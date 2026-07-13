import MessageModel from "../models/Messages.js"



// create new message : /api/message/create-new-message
export const newMessage = async (req, res) => {
    const messageData = req.body
    try {
        if (req.files) {
            const files = req.files
            const imageURLs = files.map((file) => `${file.filename}`)


            messageData.images = imageURLs

        }

        messageData.conversationID = req.body.conversationID
        messageData.sender = req.body.sender

        const userMessage = new MessageModel({
            conversationID: messageData.conversationID,
            sender: messageData.sender,
            images: messageData.images ? messageData.images : undefined,
        })

        await message.save()

        return res.json({
            success: true,
            message: "",
            userMessage
        });


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });

    }
}