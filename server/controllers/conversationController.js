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


// Get seller conversation : /api/conversation/get-seller-conversation
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