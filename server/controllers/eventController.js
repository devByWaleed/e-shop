import { uploadBufferToCloudinary, getCloudinaryPublicId } from "../config/cloudinary.js";
import EventModel from "../models/Events.js";
import SellerModel from "../models/Sellers.js";
import { v2 as cloudinary } from "cloudinary";


// Helper function to clean up expired events
const cleanupExpiredEvents = async () => {
    try {
        const currentDate = new Date();
        // Find events whose finish_Date is in the past
        const expiredEvents = await EventModel.find({ finish_Date: { $lt: currentDate } });

        if (expiredEvents.length > 0) {
            for (const event of expiredEvents) {
                // Delete images from Cloudinary
                if (event.images && event.images.length > 0) {
                    const publicIds = event.images
                        .map(imgUrl => getCloudinaryPublicId(imgUrl))
                        .filter(id => id !== null);

                    if (publicIds.length > 0) {
                        try {
                            await cloudinary.api.delete_resources(publicIds);
                        } catch (cloudinaryErr) {
                            console.error("Cloudinary expired event image deletion failed:", cloudinaryErr.message);
                        }
                    }
                }
                // Delete the event from database
                await EventModel.findByIdAndDelete(event._id);
            }
        }
    } catch (error) {
        console.error("Error cleaning up expired events:", error.message);
    }
};


// Create Event Product : /api/event/event-product
export const eventProduct = async (req, res) => {
    let uploadedPublicIds = [];

    try {
        const shopID = req.sellerID;   // from the login token
        const { name, category, discountPrice, stock, status, finish_Date, start_Date } = req.body;

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

        if (typeof description === 'string') {
            description = description.split('\n');
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
            shop: { _id: shop._id, name: shop.name, avatar: shop.avatar }
        };

        const eventProduct = await EventModel.create(eventData);

        return res.json({ success: true, message: "Event Product Added Successfully", eventProduct });

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


// Get All Events ( Specific Shop ) : /api/event/get-shop-events
export const getShopEvents = async (req, res) => {
    try {
        // Clean up before fetching
        await cleanupExpiredEvents();
        const shopEvents = await EventModel.find({ shopId: req.params.id })

        res.json({
            success: true,
            shopEvents
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Get All Events : /api/event/get-all-events
export const getAllEvents = async (req, res) => {
    try {
        // Clean up before fetching
        await cleanupExpiredEvents();

        // No ?page= in the URL: behave exactly like before
        if (!req.query.page) {
            const allEvents = await EventModel.find({}).sort({ createdAt: -1 })
            return res.json({ success: true, allEvents });
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 24, 100);

        const [allEvents, total] = await Promise.all([
            EventModel.find({}).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
            EventModel.countDocuments()
        ]);

        return res.json({
            success: true,
            allEvents,
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


// Delete Event : /api/event/delete-event
export const deleteEvents = async (req, res) => {
    try {
        const eventID = req.params.id

        // Get the event data
        const event = await EventModel.findOne({ _id: eventID, shopId: req.sellerID })

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

        return res.json({
            success: false,
            message: error.message
        });
    }
}