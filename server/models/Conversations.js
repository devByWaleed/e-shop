import mongoose from "mongoose"

// Creating product schema
const ConversationSchema = new mongoose.Schema({
    groupTitle: {
        type: String,
    },
    members: {
        type: Array,
    },
    lastMessage: {
        type: String,
    },
    lastMessageID: {
        type: String,
    },
}, { timestamps: true });


// .model gets collection name & schema
const ConversationModel = mongoose.models.conversation || mongoose.model("conversation", ConversationSchema)

export default ConversationModel