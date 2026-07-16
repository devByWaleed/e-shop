import express from "express"
import { upload } from "../config/multer.js";
import { getMessages, newMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.post("/create-new-message", upload.array("images", 5), newMessage)
messageRouter.get("/get-all-messages/:id", getMessages)

export default messageRouter