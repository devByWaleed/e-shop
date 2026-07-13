import express from "express"
import { upload } from "../config/multer.js";
import { newMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.post("/create-new-message", upload.single("file"), newMessage)

export default messageRouter