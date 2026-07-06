import express from "express"
import { upload } from "../config/multer.js";
import { getProfile, login, register, activateAccount, logout, updateProfile } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import requiredRole from "../middleware/requireRole.js";


const userRouter = express.Router();

userRouter.post("/register", upload.single("file"), register)
userRouter.post("/activation", activateAccount)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.get("/profile", userAuth, requiredRole("user"), getProfile)
userRouter.put("/update-profile", userAuth, requiredRole("user"), upload.single("file"), updateProfile)

export default userRouter