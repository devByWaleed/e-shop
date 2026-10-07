import express from "express"
import { getAdminConversations, getConversationById, getSellerConversations, getUserConversations, newConversation, updateLastMessage } from "../controllers/conversationController.js";
import anyAuth from "../middleware/anyAuth.js";


const conversationRouter = express.Router();

conversationRouter.post("/create-new-conversation", anyAuth, newConversation)
conversationRouter.get("/get-seller-conversation/:id", anyAuth, getSellerConversations)
conversationRouter.get("/get-user-conversation/:id", anyAuth, getUserConversations)
conversationRouter.get("/get-conversation/:id", anyAuth, getConversationById)
conversationRouter.get("/get-admin-conversations/:id", anyAuth, getAdminConversations)
conversationRouter.put("/update-last-message/:id", anyAuth, updateLastMessage)

export default conversationRouter