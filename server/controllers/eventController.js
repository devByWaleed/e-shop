import { getCloudinaryPublicId } from "../config/cloudinary.js";
import EventModel from "../models/Events.js";
import SellerModel from "../models/Sellers.js";
import { v2 as cloudinary } from "cloudinary";


// Create Event Product : /api/event/event-product
export const eventProduct = async (req, res) => {
    let uploadedPublicIds = []; // tracks successful uploads for rollback

    try {
        const { shopID, name, category, discountPrice, stock, status, finish_Date, start_Date } = req.body;

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

        const eventData = {
            name,
            description,
            category,
            finish_Date,
            start_Date,
            status,
            tags: req.body.tags,
            originalPrice: Number(req.body.originalPrice),
            discountPrice: Number(discountPrice),
            stock: Number(stock),
            images: imagesURL,
            shopId: shop._id,
            shop: shop,
        };

        const eventProduct = await EventModel.create(eventData);

        return res.json({ success: true, message: "Event Product Added Successfully", eventProduct });

    } catch (error) {
        console.log("Error inside eventProduct:", error.message);

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


// Get All Event : /api/event/get-all-events
export const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find({ shopId: req.params.id })

        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Delete Event : /api/event/delete-event
export const deleteEvents = async (req, res) => {
    try {
        const eventID = req.params.id

        // Get the event data
        const event = await EventModel.findById(eventID)

        if (!event) {
            return res.json({
                success: false,
                message: "Event not found"
            });
        }

        // Checking & Gather all Public IDs for bulk deletion
        if (event.images && event.images.length > 0) {
            const publicIds = event.images
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

        // Delete the event
        await EventModel.findByIdAndDelete(eventID);

        res.json({
            success: true,
            message: "Event deleted successfully"
        });


    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}