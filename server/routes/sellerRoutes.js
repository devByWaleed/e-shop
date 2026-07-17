import express from "express"
import { upload } from "../config/multer.js";
import { sellerRegister, activateAccount, sellerLogin, sellerLogout, sellerProfile, getSellerInfo, sendResetOTP, verifyResetOTP, resetPassword, searchSellers, updateSellerProfile } from "../controllers/sellerController.js";
import sellerAuth from "../middleware/sellerAuth.js";
import requiredRole from "../middleware/requireRole.js";


const sellerRouter = express.Router();

sellerRouter.post("/seller-register", upload.single("file"), sellerRegister)
sellerRouter.post("/seller-activation", activateAccount)
sellerRouter.post("/seller-login", sellerLogin)
sellerRouter.post("/seller-logout", sellerLogout)
sellerRouter.get("/seller-profile", sellerAuth, requiredRole("seller"), sellerProfile)
sellerRouter.post("/seller-send-reset-otp", sendResetOTP)
sellerRouter.post("/seller-verify-reset-otp", verifyResetOTP)
sellerRouter.post("/seller-reset-password", resetPassword)
sellerRouter.get("/get-seller/:id", getSellerInfo)
sellerRouter.get("/search-sellers", searchSellers);
sellerRouter.put("/update-seller-profile", sellerAuth, requiredRole("seller"), upload.single("file"), updateSellerProfile)

export default sellerRouter