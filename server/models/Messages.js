import mongoose from "mongoose"

// Creating product schema
const MessageSchema = new mongoose.Schema({
    conversationID: {
        type: String,
    },
    sender: {
        type: String,
    },
    text: {
        type: String,
    },
    images: [
        {
            type: String,
        }
    ],
    lastMessageID: {
        type: String,
    },
}, { timestamps: true });


// .model gets collection name & schema
const MessageModel = mongoose.models.message || mongoose.model("message", MessageSchema)

export default MessageModel