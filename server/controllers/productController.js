import ProductModel from "../models/Products.js";
import SellerModel from "../models/Sellers.js";
import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const cleanName = file.originalname.split(".")[0].replace(/\s+/g, "-");

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "Zenvio Media",
                allowed_formats: ["jpg", "png", "jpeg", "webp"],
                public_id: `${cleanName}-${uniqueSuffix}`,
                resource_type: "image"
            },
            (error, result) => {
                if (result) {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                } else {
                    reject(error);
                }
            }
        );

        stream.end(file.buffer);
    });
};

const cleanupUploadedImages = async (uploadedImages) => {
    if (!uploadedImages.length) return;

    await Promise.allSettled(
        uploadedImages.map(({ public_id }) => cloudinary.uploader.destroy(public_id))
    );
};

// Create Product : /api/product/create-product
export const createProduct = async (req, res) => {
    try {
        const { shopID } = req.body;

        if (!shopID) {
            return res.json({
                success: false,
                message: "Shop ID is required. Product creation failed."
            });
        }

        const shop = await SellerModel.findById(shopID);

        if (!shop) {
            return res.json({
                success: false,
                message: "Invalid Shop ID. Product creation failed."
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.json({
                success: false,
                message: "Please upload at least one product image."
            });
        }

        const uploadedImages = [];

        try {
            for (const file of req.files) {
                const uploadedImage = await uploadToCloudinary(file);
                uploadedImages.push(uploadedImage);
            }
        } catch (error) {
            await cleanupUploadedImages(uploadedImages);
            return res.json({
                success: false,
                message: error.message || "Image upload failed."
            });
        }

        const productData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            tags: req.body.tags,
            originalPrice: Number(req.body.originalPrice),
            discountPrice: Number(req.body.discountPrice),
            stock: Number(req.body.stock),
            images: uploadedImages.map((image) => image.url),
            shopId: shop._id,
            shop: shop
        };

        try {
            const product = await ProductModel.create(productData);

            return res.json({
                success: true,
                message: "Product Added Successfully",
                product
            });
        } catch (error) {
            await cleanupUploadedImages(uploadedImages);
            return res.json({
                success: false,
                message: error.message || "Product creation failed."
            });
        }

    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};