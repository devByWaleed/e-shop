import ProductModel from "../models/Products.js";
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

        const product = await ProductModel.findByIdAndDelete(productID)

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

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