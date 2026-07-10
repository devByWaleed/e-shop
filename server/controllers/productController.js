import { getCloudinaryPublicId } from "../config/cloudinary.js";
import ProductModel from "../models/Products.js";
import OrderModel from "../models/Orders.js";
import SellerModel from "../models/Sellers.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product : /api/product/create-product
export const createProduct = async (req, res) => {
    let uploadedPublicIds = []; // tracks successful uploads for rollback

    try {
        const { shopID, name, category, discountPrice, stock } = req.body;

        // --- Validate everything BEFORE touching Cloudinary ---
        if (!shopID) {
            return res.json({ success: false, message: "Shop ID is required. Product creation failed." });
        }

        const shop = await SellerModel.findById(shopID);
        if (!shop) {
            return res.json({ success: false, message: "Invalid Shop ID. Product creation failed." });
        }

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "Please upload at least one product image." });
        }

        if (!name || !category || discountPrice === undefined || stock === undefined) {
            return res.json({ success: false, message: "Missing required product fields." });
        }

        // Normalize description into an array (see section 2 below)
        let description = req.body.description;
        if (!description) {
            return res.json({ success: false, message: "Please add a product description." });
        }
        description = Array.isArray(description) ? description : [description];
        description = description.map(line => line.trim()).filter(line => line.length > 0);
        if (description.length === 0) {
            return res.json({ success: false, message: "Please add a product description." });
        }

        // --- Only now do we start uploading, one at a time so we can track/rollback ---
        let imagesURL = [];
        for (const image of req.files) {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "Zenvio Media",
                resource_type: "image"
            });
            uploadedPublicIds.push(result.public_id);
            imagesURL.push(result.secure_url);
        }

        const productData = {
            name,
            description,
            category,
            tags: req.body.tags,
            originalPrice: Number(req.body.originalPrice),
            discountPrice: Number(discountPrice),
            stock: Number(stock),
            images: imagesURL,
            shopId: shop._id,
            shop: shop
        };

        const product = await ProductModel.create(productData);

        return res.json({ success: true, message: "Product Added Successfully", product });

    } catch (error) {
        console.log("Error inside createProduct:", error.message);

        // Roll back any images that were uploaded before the failure happened
        if (uploadedPublicIds.length > 0) {
            try {
                await cloudinary.api.delete_resources(uploadedPublicIds);
                console.log("Cleaned up orphaned images:", uploadedPublicIds);
            } catch (cleanupError) {
                console.log("Failed to clean up orphaned images:", cleanupError.message);
            }
        }

        return res.json({ success: false, message: error.message });
    }
};


// Get All Products : /api/product/get-all-products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ shopId: req.params.id })

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Delete Product : /api/product/delete-shop-product
export const deleteProducts = async (req, res) => {
    try {
        const productID = req.params.id

        // Get the product Data
        const product = await ProductModel.findById(productID)

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        // Checking for images & Gather all Public IDs for bulk deletion
        if (product.images && product.images.length > 0) {
            const publicIds = product.images
                .map(imgUrl => getCloudinaryPublicId(imgUrl))
                .filter(id => id !== null);

            if (publicIds.length > 0) {
                try {
                    // Bulk delete all images at once
                    await cloudinary.api.delete_resources(publicIds);
                } catch (cloudinaryErr) {
                    console.error("Cloudinary bulk event image deletion failed:", cloudinaryErr.message);
                }
            }
        }

        // Delete the product
        await ProductModel.findByIdAndDelete(productID)

        res.json({
            success: true,
            message: "Product deleted successfully"
        });


    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Create Review : /api/product/create-new-review
export const createReview = async (req, res) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body
        const reviewerId = req.userID || user?._id

        if (!reviewerId) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        const review = {
            user: {
                ...user,
                _id: reviewerId
            },
            rating,
            comment,
            productId
        }

        const isReviewed = product.reviews.find(
            (rev) => rev.user?._id?.toString() === reviewerId.toString()
        )

        if (isReviewed) {
            product.reviews = product.reviews.map((rev) => {
                if (rev.user?._id?.toString() === reviewerId.toString()) {
                    return {
                        ...rev,
                        rating,
                        comment,
                        user: review.user
                    }
                }
                return rev
            })
        } else {
            product.reviews.push(review)
        }

        const avg = product.reviews.reduce((sum, rev) => sum + (Number(rev.rating) || 0), 0)
        product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0

        await product.save({ validateBeforeSave: false })

        if (orderId) {
            const order = await OrderModel.findById(orderId)
            if (order) {
                let updated = false
                order.cart = order.cart.map((item) => {
                    const itemProductId = item.product?._id?.toString() || item.product?.toString()
                    if (itemProductId === productId?.toString()) {
                        updated = true
                        return {
                            ...item.toObject?.(),
                            isReviewed: true,
                            rating
                        }
                    }
                    return item
                })

                if (updated) {
                    await order.save({ validateBeforeSave: false })
                }
            }
        }

        return res.json({
            success: true,
            message: "Review created successfully"
        });

    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}