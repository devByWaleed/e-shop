import express from "express"
import { getSellerConversations, newConversation } from "../controllers/conversationController.js";


const conversationRouter = express.Router();

conversationRouter.post("/create-new-conversation", newConversation)
conversationRouter.get("/get-seller-conversation/:id", getSellerConversations)

export default conversationRouter