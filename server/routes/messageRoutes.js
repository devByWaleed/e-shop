import express from "express"
import { upload } from "../config/multer.js";
import { getMessages, markSeen, newMessage } from "../controllers/messageController.js";
import anyAuth from "../middleware/anyAuth.js";


const messageRouter = express.Router();

messageRouter.post("/create-new-message", anyAuth, upload.array("images", 5), newMessage)
messageRouter.get("/get-all-messages/:id", anyAuth, getMessages)
messageRouter.put("/mark-seen/:id", anyAuth, markSeen)

export default messageRouter