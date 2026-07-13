import mongoose from "mongoose"

// Creating product schema
const MessageSchema = new mongoose.Schema({
    conversationID: {
        type: String,
    },
    sender: {
        type: Array,
    },
    images: [
        {
            type: String,
        }
    ],
    lastMessageID: {
        type: String,
    },

    // createdAt: {
    //     type: Date,
    //     default: Date.now(),
    // }
}, { timestamps: true });


// .model gets collection name & schema
const MessageModel = mongoose.models.message || mongoose.model("message", MessageSchema)

export default MessageModel