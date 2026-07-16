import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationID: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    images: [{
        type: String
    }],
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;