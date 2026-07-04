import express from "express"
import { upload } from "../config/multer.js";
import { eventProduct, getShopEvents, getAllEvents, deleteEvents } from "../controllers/eventController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const eventRouter = express.Router();

eventRouter.post("/event-product", sellerAuth, upload.array("images", 10), eventProduct)
eventRouter.get("/get-shop-events/:id", getShopEvents)
eventRouter.get("/get-all-events", getAllEvents)
eventRouter.delete("/delete-event/:id", deleteEvents)

export default eventRouter