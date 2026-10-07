import express from "express"
import { refreshSessions } from "../controllers/authController.js";


const authRouter = express.Router();

authRouter.post("/refresh", refreshSessions)

export default authRouter
