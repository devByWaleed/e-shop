import MessageModel from "../models/Messages.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// create new message with image support
export const newMessage = async (req, res) => {
    const messageData = req.body;
    try {
        let imageUrls = [];

        // Upload images to Cloudinary if present
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'Zenvio Media/Chats Media',
                        transformation: [
                            { width: 800, crop: 'limit' }, // Bumped slightly for readable chat images
                            { quality: 'auto' }
                        ]
                    });

                    // Clean up local temp file synchronously or asynchronously
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }

                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    // Clean up even if upload failed
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    return null;
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls = uploadedUrls.filter(url => url !== null);
        }

        // Create message with images
        const userMessage = new MessageModel({
            conversationID: messageData.conversationID,
            sender: messageData.sender,
            text: messageData.text || '',
            images: imageUrls.length > 0 ? imageUrls : undefined,
        });

        await userMessage.save();

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            userMessage
        });

    } catch (error) {
        console.error("New message error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({
            conversationID: req.params.id
        }).sort({ createdAt: 1 });

        return res.json({
            success: true,
            messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};