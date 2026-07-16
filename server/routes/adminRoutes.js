import express from "express"
import { upload } from "../config/multer.js";
import { adminEvents, adminLogin, adminLogout, adminOrders, adminProducts, adminSellers, adminUsers, deleteSeller, deleteUser, verifyAdmin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import requiredRole from "../middleware/requireRole.js";


const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin)
adminRouter.get("/verify-admin", verifyAdmin)
adminRouter.post("/admin-logout", adminLogout)
adminRouter.get("/admin-sellers", adminAuth, requiredRole("admin"), adminSellers)
adminRouter.get("/admin-users", adminAuth, requiredRole("admin"), adminUsers)
adminRouter.get("/admin-products", adminAuth, requiredRole("admin"), adminProducts)
adminRouter.get("/admin-events", adminAuth, requiredRole("admin"), adminEvents)
adminRouter.get("/admin-orders", adminAuth, requiredRole("admin"), adminOrders)

adminRouter.delete("/delete-user-by-id/:id", adminAuth, requiredRole("admin"), deleteUser)
adminRouter.delete("/delete-seller-by-id/:id", adminAuth, requiredRole("admin"), deleteSeller)

export default adminRouter