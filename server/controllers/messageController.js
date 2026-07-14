import MessageModel from "../models/Messages.js"

// create new message : /api/message/create-new-message
export const newMessage = async (req, res) => {
    const messageData = req.body
    try {
        if (req.files && req.files.length > 0) {
            const files = req.files
            const imageURLs = files.map((file) => `${file.filename}`)
            messageData.images = imageURLs
        }

        const userMessage = new MessageModel({
            conversationID: messageData.conversationID,
            sender: messageData.sender,
            text: messageData.text,
            images: messageData.images ? messageData.images : undefined,
        })

        await userMessage.save()

        return res.json({
            success: true,
            message: "",
            userMessage
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

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
}