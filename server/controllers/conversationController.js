import ConversationModel from "../models/Conversations.js";




// Create a new conversation : /api/conversation/
export const newConversation = async (req, res) => {
    try {
        const { groupTitle, userID, sellerID } = req.body

        const isConversationExists = await ConversationModel.findOne({ groupTitle })

        if (isConversationExists) {
            return res.json({
                success: false,
                message: "Conversation group already exists with this seller"
            });
        }

        const conversation = await ConversationModel.create({
            members: [userID, sellerID],
            groupTitle: groupTitle,
        })

        return res.json({
            success: true,
            // message: "Conversation  successfully!",
            conversation
        });


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Get seller conversation : /api/conversation/get-seller-conversation/:id
export const getSellerConversations = async (req, res) => {
    try {
        const conversations = await ConversationModel.find({
            members: {
                $in: [req.params.id],
            }
        }).sort({ updatedAt: -1, createdAt: -1 })

        return res.json({
            success: true,
            conversations
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });

    }
}

// Get user conversations : /api/conversation/get-user-conversation/:id
export const getUserConversations = async (req, res) => {
    try {
        const conversations = await ConversationModel.find({
            members: {
                $in: [req.params.id],
            }
        }).sort({ updatedAt: -1, createdAt: -1 })

        return res.json({
            success: true,
            conversations
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}


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


// Update last message : /api/conversation/:id
export const updateLastMessage = async (req, res) => {
    try {
        const { lastMessage, lastMessageID } = req.body

        const lastConversation = await ConversationModel.findByIdAndUpdate(
            req.params.id,
            { lastMessage, lastMessageID },
            { new: true } // FIXED: return the updated doc, not the stale pre-update one
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