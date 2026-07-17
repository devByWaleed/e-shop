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
    // NEW: lets you query "unseen messages sent TO this admin/user/seller"
    // directly, without joining back through the conversation's members list
    receiver: {
        type: String,
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

messageSchema.index({ conversationID: 1, createdAt: 1 });


const MessageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default MessageModel;