import { uploadBufferToCloudinary, getCloudinaryPublicId } from "../config/cloudinary.js";
import ProductModel from "../models/Products.js";
import OrderModel from "../models/Orders.js";
import SellerModel from "../models/Sellers.js";
import UserModel from "../models/Users.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product : /api/product/create-product
export const createProduct = async (req, res) => {
    let uploadedPublicIds = [];

    try {
        const shopID = req.sellerID;   // from the login token, not from the request body
        const { name, category, discountPrice, stock } = req.body;

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

        let description = req.body.description;
        if (!description) {
            return res.json({ success: false, message: "Please add a product description." });
        }
        description = Array.isArray(description) ? description : [description];
        description = description.map(line => line.trim()).filter(line => line.length > 0);
        if (description.length === 0) {
            return res.json({ success: false, message: "Please add a product description." });
        }

        let imagesURL = [];
        for (const image of req.files) {
            const result = await uploadBufferToCloudinary(image.buffer, {
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
            shop: { _id: shop._id, name: shop.name, avatar: shop.avatar }
        };

        const product = await ProductModel.create(productData);

        return res.json({ success: true, message: "Product Added Successfully", product });

    } catch (error) {

        if (uploadedPublicIds.length > 0) {
            try {
                await cloudinary.api.delete_resources(uploadedPublicIds);
            } catch (cleanupError) {
                console.log("Failed to roll back cloudinary assets:", cleanupError.message);
            }
        }

        return res.json({ success: false, message: error.message });
    }
};

// Get Shop Products : /api/product/get-all-products/:id
export const getShopProducts = async (req, res) => {
    try {
        const shopProducts = await ProductModel.find({ shopId: req.params.id })

        res.json({
            success: true,
            shopProducts
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Get All Products : /api/product/get-all-products/:id
export const getAllProducts = async (req, res) => {
    try {
        // No ?page= in the URL: behave exactly like before
        if (!req.query.page) {
            const allProducts = await ProductModel.find({}).sort({ createdAt: -1 })
            return res.json({ success: true, allProducts });
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 24, 100);

        const [allProducts, total] = await Promise.all([
            ProductModel.find({}).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
            ProductModel.countDocuments()
        ]);

        return res.json({
            success: true,
            allProducts,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {

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
        const product = await ProductModel.findOne({ _id: productID, shopId: req.sellerID })

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

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Create Review : /api/product/create-new-review
export const createReview = async (req, res) => {
    try {
        const { rating, comment, productId, orderId } = req.body
        const reviewerId = req.userID   // userAuth guarantees this

        // 1. The rating must be a number from 1 to 5
        const ratingNumber = Number(rating)
        if (!Number.isFinite(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" })
        }

        const product = await ProductModel.findById(productId).select("_id")
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        const productObjectId = product._id

        // 2. The buyer must have RECEIVED this product
        const purchase = await OrderModel.exists({
            user: reviewerId,
            status: "Delivered",
            "cart.product._id": { $in: [String(productObjectId), productObjectId] },
        })
        if (!purchase) {
            return res.json({ success: false, message: "You can only review products you have received" })
        }

        // 3. Name and avatar come from the database, never from the browser
        const reviewer = await UserModel.findById(reviewerId).select("name avatar")
        if (!reviewer) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        const review = {
            user: { _id: reviewerId, name: reviewer.name, avatar: reviewer.avatar },
            rating: ratingNumber,
            comment: String(comment || "").slice(0, 1000),
            productId: String(productObjectId),
        }

        // 4a. If the buyer already reviewed this product, change that review
        const updated = await ProductModel.updateOne(
            { _id: productObjectId, "reviews.user._id": reviewerId },
            {
                $set: {
                    "reviews.$.rating": review.rating,
                    "reviews.$.comment": review.comment,
                    "reviews.$.user": review.user,
                }
            }
        )

        // 4b. Otherwise add a new one (the $ne means a double click adds it only once)
        if (updated.matchedCount === 0) {
            await ProductModel.updateOne(
                { _id: productObjectId, "reviews.user._id": { $ne: reviewerId } },
                { $push: { reviews: review } }
            )
        }

        // 5. The database calculates the average rating
        const [result] = await ProductModel.aggregate([
            { $match: { _id: productObjectId } },
            { $project: { average: { $avg: "$reviews.rating" } } },
        ])
        await ProductModel.updateOne(
            { _id: productObjectId },
            { $set: { ratings: result?.average || 0 } }
        )

        // 6. Mark the product as reviewed inside the buyer's order
        if (orderId) {
            await OrderModel.updateOne(
                { _id: orderId, user: reviewerId },
                { $set: { "cart.$[item].isReviewed": true, "cart.$[item].rating": review.rating } },
                { arrayFilters: [{ "item.product._id": { $in: [String(productObjectId), productObjectId] } }] }
            )
        }

        return res.json({ success: true, message: "Review created successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
