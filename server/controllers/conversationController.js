import ConversationModel from "../models/Conversations.js";

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
        console.log('Request body:', req.body);
        console.log('Headers:', req.headers['content-type']);
        const { senderID, senderRole, receiverID, receiverRole } = req.body

        // Log individual values
        console.log('senderID:', senderID);
        console.log('receiverID:', receiverID);

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

// Get seller conversations : /api/conversation/get-seller-conversation/:id
export const getSellerConversations = async (req, res) => {
    try {
        const conversations = await getConversationsByMemberId(req.params.id)
        return res.json({ success: true, conversations });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get user conversations : /api/conversation/get-user-conversation/:id
export const getUserConversations = async (req, res) => {
    try {
        const conversations = await getConversationsByMemberId(req.params.id)
        return res.json({ success: true, conversations });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get Admin conversations: /api/conversation/get-admin-conversations/:id
export const getAdminConversations = async (req, res) => {
    try {
        const conversations = await getConversationsByMemberId(req.params.id)
        return res.json({ success: true, conversations });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const getConversationById = async (req, res) => {
    try {
        const conversation = await ConversationModel.findById(req.params.id)

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

        const lastConversation = await ConversationModel.findByIdAndUpdate(
            req.params.id,
            { lastMessage, lastMessageID },
            { new: true }
        )

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