import MessageModel from "../models/Messages.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// create new message with image support (works for user/seller/admin senders —
// `sender` is just an opaque ID, same as it already was)
export const newMessage = async (req, res) => {
    const messageData = req.body;
    try {
        const { conversationID, sender, receiver, text } = messageData;

        if (!conversationID || !sender) {
            return res.status(400).json({
                success: false,
                message: "conversationID and sender are required"
            });
        }

        const hasImages = req.files && req.files.length > 0;

        // FIXED: previously a request with no text and no files would
        // silently save an empty message
        if (!text?.trim() && !hasImages) {
            return res.status(400).json({
                success: false,
                message: "A message needs text or at least one image"
            });
        }

        let imageUrls = [];

        // Upload images to Cloudinary if present
        if (hasImages) {
            const uploadPromises = req.files.map(async (file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'Zenvio Media/Chats Media',
                        transformation: [
                            { width: 800, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    });

                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }

                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    return null;
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls = uploadedUrls.filter(url => url !== null);

            // FIXED: if every upload failed and there's no text either,
            // don't silently save a blank message — surface the failure
            if (imageUrls.length === 0 && !text?.trim()) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed and no text was provided"
                });
            }
        }

        const userMessage = new MessageModel({
            conversationID,
            sender,
            receiver, // NEW: optional, but recommended — see Messages.js
            text: text || '',
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