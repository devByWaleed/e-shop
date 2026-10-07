import ConversationModel from "../models/Conversations.js";
import { isActor, actorIds } from "../middleware/anyAuth.js";

const VALID_ROLES = ["user", "seller", "admin"];

// Order-independent title so {A,B} and {B,A} always map to the same
// conversation, regardless of which side (user/seller/admin) opens it first
const buildGroupTitle = (idA, idB) => [idA, idB].sort().join("_");


// Create a new conversation between ANY two parties (user<->seller,
// admin<->user, or admin<->seller). : POST /api/conversation/create-new-conversation
// Body: { senderID, senderRole, receiverID, receiverRole }
export const newConversation = async (req, res) => {
    try {
        // Debug: Log the entire request body


        const { senderID, senderRole, receiverID, receiverRole } = req.body

        // Log individual values



        if (!senderID || !receiverID) {
            return res.status(400).json({
                success: false,
                message: "senderID and receiverID are required"
            });
        }

        if (senderID === receiverID) {
            return res.status(400).json({
                success: false,
                message: "Cannot create a conversation with yourself"
            });
        }

        // The logged-in person must really be the sender
        if (!isActor(req, senderID)) {
            return res.status(403).json({ success: false, message: "You can only start conversations as yourself" });
        }

        if ((senderRole && !VALID_ROLES.includes(senderRole)) ||
            (receiverRole && !VALID_ROLES.includes(receiverRole))) {
            return res.status(400).json({
                success: false,
                message: `role must be one of ${VALID_ROLES.join(", ")}`
            });
        }

        const groupTitle = buildGroupTitle(senderID, receiverID)

        // FIXED: findOneAndUpdate + upsert instead of findOne-then-create.
        // The old pattern raced two simultaneous requests for the same pair
        // into creating two separate conversations. This is atomic, and
        // relies on the schema's unique index on groupTitle as a backstop.
        const conversation = await ConversationModel.findOneAndUpdate(
            { groupTitle },
            {
                $setOnInsert: {
                    groupTitle,
                    members: [senderID, receiverID],
                    memberRoles: {
                        [senderID]: senderRole,
                        [receiverID]: receiverRole
                    }
                }
            },
            { new: true, upsert: true }
        )

        return res.json({
            success: true,
            conversation
        });

    } catch (error) {
        // Duplicate key race (extremely rare with upsert, but possible under
        // concurrent first-time creation) — just fetch and return the winner
        if (error.code === 11000) {
            const existing = await ConversationModel.findOne({
                groupTitle: buildGroupTitle(req.body.senderID, req.body.receiverID)
            })
            if (existing) {
                return res.json({ success: true, conversation: existing });
            }
        }

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Shared lookup used by all three "get my conversations" endpoints below —
// works identically for a user ID, seller ID, or admin ID since `members`
// is just an array of opaque IDs.
const getConversationsByMemberId = async (memberId) => {
    return ConversationModel.find({
        members: { $in: [memberId] }
    }).sort({ updatedAt: -1, createdAt: -1 })
}

const getMyConversations = async (req, res) => {
    try {
        // You can only list your own conversations
        if (!isActor(req, req.params.id)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        const conversations = await getConversationsByMemberId(req.params.id)
        return res.json({ success: true, conversations });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getSellerConversations = getMyConversations
export const getUserConversations = getMyConversations
export const getAdminConversations = getMyConversations


export const getConversationById = async (req, res) => {
    try {
        // Only returns it if you are one of its two members
        const conversation = await ConversationModel.findOne({
            _id: req.params.id,
            members: { $in: actorIds(req) }
        })

        if (!conversation) {
            return res.json({
                success: false,
                message: "Conversation not found"
            });
        }

        return res.json({
            success: true,
            conversation
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Update last message : /api/conversation/update-last-message/:id
export const updateLastMessage = async (req, res) => {
    try {
        const { lastMessage, lastMessageID } = req.body

        const lastConversation = await ConversationModel.findOneAndUpdate(
            { _id: req.params.id, members: { $in: actorIds(req) } },
            { lastMessage, lastMessageID },
            { new: true }
        )

        if (!lastConversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        return res.json({
            success: true,
            lastConversation
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}