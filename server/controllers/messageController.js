import MessageModel from "../models/Messages.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import ConversationModel from "../models/Conversations.js";
import { isActor, actorIds } from "../middleware/anyAuth.js";


export const newMessage = async (req, res) => {
    const messageData = req.body;
    try {
        const { conversationID, sender, text } = messageData;   // receiver is no longer taken from the body

        if (!conversationID || !sender) {
            return res.status(400).json({
                success: false,
                message: "conversationID and sender are required"
            });
        }

        // The sender must be the logged-in person...
        if (!isActor(req, sender)) {
            return res.status(403).json({ success: false, message: "You can only send messages as yourself" });
        }

        // ...and must belong to this conversation (checked BEFORE any image upload)
        const conversation = await ConversationModel.findOne({ _id: conversationID, members: String(sender) });
        if (!conversation) {
            return res.status(403).json({ success: false, message: "Not allowed in this conversation" });
        }

        // The receiver is the other member of the conversation
        const receiver = conversation.members.find((member) => member !== String(sender));

        const hasImages = req.files && req.files.length > 0;

        if (!text?.trim() && !hasImages) {
            return res.status(400).json({
                success: false,
                message: "A message needs text or at least one image"
            });
        }

        let imageUrls = [];

        if (hasImages) {
            const uploadPromises = req.files.map(async (file) => {
                try {
                    const result = await uploadBufferToCloudinary(file.buffer, {
                        folder: 'Zenvio Media/Chats Media',
                        transformation: [
                            { width: 800, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    });
                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    return null;
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls = uploadedUrls.filter(url => url !== null);

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
            receiver,
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
        // Only members of the conversation can read its messages
        const allowed = await ConversationModel.exists({
            _id: req.params.id,
            members: { $in: actorIds(req) }
        });
        if (!allowed) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

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

// Mark messages as seen : /api/message/mark-seen/:id   (id = conversation id)
export const markSeen = async (req, res) => {
    try {
        // Only members of the conversation can do this
        const allowed = await ConversationModel.exists({
            _id: req.params.id,
            members: { $in: actorIds(req) }
        });
        if (!allowed) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        // Only messages that were sent TO the logged-in person
        await MessageModel.updateMany(
            { conversationID: req.params.id, receiver: { $in: actorIds(req) }, seen: false },
            { $set: { seen: true } }
        );

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};