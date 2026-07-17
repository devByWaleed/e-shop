import express from "express"
import { getAdminConversations, getConversationById, getSellerConversations, getUserConversations, newConversation, updateLastMessage } from "../controllers/conversationController.js";


const conversationRouter = express.Router();

conversationRouter.post("/create-new-conversation", newConversation)
conversationRouter.get("/get-seller-conversation/:id", getSellerConversations)
conversationRouter.get("/get-user-conversation/:id", getUserConversations)
conversationRouter.get("/get-conversation/:id", getConversationById)
conversationRouter.get("/get-admin-conversations/:id", getAdminConversations)
conversationRouter.put("/update-last-message/:id", updateLastMessage)

export default conversationRouter