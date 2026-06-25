import express from "express"
import { upload } from "../config/multer.js";
import { register, activateAccount, login, logout, sellerProfile } from "../controllers/sellerController.js";
import userAuth from "../middleware/userAuth.js";
import requiredRole from "../middleware/requireRole.js";


const sellerRouter = express.Router();

sellerRouter.post("/register", upload.single("file"), register)
sellerRouter.post("/seller-activation", activateAccount)
sellerRouter.post("/login", login)
sellerRouter.post("/logout", logout)
sellerRouter.get("/profile", userAuth, requiredRole("seller"), sellerProfile)

export default sellerRouter