import express from "express"
import { upload } from "../config/multer.js";
import { getProfile, login, register, activateAccount, logout } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";


const userRouter = express.Router();

userRouter.post("/register", upload.single("file"), register)
userRouter.post("/activation", activateAccount)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.get("/profile", userAuth, getProfile)

export default userRouter