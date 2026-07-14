import express from "express"
import { upload } from "../config/multer.js";
import { getProfile, login, register, activateAccount, logout, updateProfile, sendResetOTP, resetPassword, verifyResetOTP, getUserInfo } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import requiredRole from "../middleware/requireRole.js";


const userRouter = express.Router();

userRouter.post("/register", upload.single("file"), register)
userRouter.post("/activation", activateAccount)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.get("/profile", userAuth, requiredRole("user"), getProfile)
userRouter.put("/update-profile", userAuth, requiredRole("user"), upload.single("file"), updateProfile)
userRouter.post("/send-reset-otp", sendResetOTP)
userRouter.post("/verify-reset-otp", verifyResetOTP)
userRouter.post("/reset-password", resetPassword)
userRouter.get("/user-info/:id", getUserInfo);

export default userRouter