import express from "express"
import { upload } from "../config/multer.js";
import { adminLogin, adminLogout, adminProducts, adminSellers, adminUsers, verifyAdmin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import requiredRole from "../middleware/requireRole.js";


const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin)
adminRouter.get("/verify-admin", verifyAdmin)
adminRouter.get("/admin-sellers", adminAuth, requiredRole("admin"), adminSellers)
adminRouter.get("/admin-users", adminAuth, requiredRole("admin"), adminUsers)
adminRouter.get("/admin-products", adminAuth, requiredRole("admin"), adminProducts)
adminRouter.post("/admin-logout", adminLogout)

export default adminRouter