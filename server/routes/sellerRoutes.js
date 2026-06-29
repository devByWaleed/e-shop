import express from "express"
import { upload } from "../config/multer.js";
import { sellerRegister, activateAccount, sellerLogin, sellerLogout, sellerProfile } from "../controllers/sellerController.js";
import sellerAuth from "../middleware/sellerAuth.js";
import requiredRole from "../middleware/requireRole.js";


const sellerRouter = express.Router();

sellerRouter.post("/seller-register", upload.single("file"), sellerRegister)
sellerRouter.post("/seller-activation", activateAccount)
sellerRouter.post("/seller-login", sellerLogin)
sellerRouter.post("/seller-logout", sellerLogout)
sellerRouter.get("/seller-profile", sellerAuth, requiredRole("seller"), sellerProfile)

export default sellerRouter