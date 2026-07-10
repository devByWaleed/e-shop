import express from "express"
import userAuth from "../middleware/userAuth.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, stripeWebhooks, getShopOrders, updateOrderStatus, updateRefund } from "../controllers/orderController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const orderRouter = express.Router();

orderRouter.post("/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhooks);

orderRouter.post("/cod", express.json(), userAuth, placeOrderCOD);
orderRouter.post("/stripe", express.json(), userAuth, placeOrderStripe);
orderRouter.get("/user-orders/:id", userAuth, getUserOrders)
orderRouter.get("/shop-orders/:id", sellerAuth, getShopOrders)
orderRouter.get("/seller", sellerAuth, getAllOrders)
orderRouter.put("/update-order-status/:id", sellerAuth, updateOrderStatus);
orderRouter.put("/order-refund/:id", userAuth, updateRefund);


export default orderRouter