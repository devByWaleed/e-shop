import mongoose from "mongoose"

const ConversationSchema = new mongoose.Schema({
    // Server-generated from the sorted member IDs (see conversationController.js).
    // Guarantees the same pair of people can never end up with two threads.
    groupTitle: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length === 2,
            message: "A conversation must have exactly 2 members"
        }
    },
    // NEW: role of each member, keyed by their ID, e.g.
    // { "664f...adminId": "admin", "664f...sellerId": "seller" }
    // Lets the frontend know at a glance who it's chatting with without
    // needing to cross-reference the Users/Sellers/Admins collections.
    memberRoles: {
        type: Map,
        of: {
            type: String,
            enum: ["user", "seller", "admin"]
        }
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