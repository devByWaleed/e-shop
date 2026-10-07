import express from "express"
import { upload } from "../config/multer.js";
import { eventProduct, getShopEvents, getAllEvents, deleteEvents } from "../controllers/eventController.js";
import sellerAuth from "../middleware/sellerAuth.js";
import requiredRole from "../middleware/requireRole.js";


const eventRouter = express.Router();

eventRouter.post("/event-product", sellerAuth, upload.array("images", 10), eventProduct)
eventRouter.get("/get-shop-events/:id", getShopEvents)
eventRouter.get("/get-all-events", getAllEvents)
eventRouter.delete("/delete-event/:id", sellerAuth, requiredRole("seller"), deleteEvents)

export default eventRouter