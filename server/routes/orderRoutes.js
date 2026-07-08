import express from "express"
import userAuth from "../middleware/userAuth.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, stripeWebhooks } from "../controllers/orderController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const orderRouter = express.Router();

orderRouter.post("/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhooks);

orderRouter.post("/cod", express.json(), userAuth, placeOrderCOD);
orderRouter.post("/stripe", express.json(), userAuth, placeOrderStripe);
orderRouter.get("/user", userAuth, getUserOrders)
orderRouter.get("/seller", sellerAuth, getAllOrders)


export default orderRouter