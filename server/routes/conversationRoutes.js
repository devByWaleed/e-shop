import express from "express"
import { getConversationById, getSellerConversations, getUserConversations, newConversation, updateLastMessage } from "../controllers/conversationController.js";


const conversationRouter = express.Router();

conversationRouter.post("/create-new-conversation", newConversation)
conversationRouter.get("/get-seller-conversation/:id", getSellerConversations)
conversationRouter.get("/get-user-conversation/:id", getUserConversations)
conversationRouter.put("/update-last-message/:id", updateLastMessage)
conversationRouter.get("/get-conversation/:id", getConversationById)

export default conversationRouter