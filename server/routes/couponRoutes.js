import express from "express"
import { createCoupon, getAllCoupons } from "../controllers/couponController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const couponRouter = express.Router();

couponRouter.post("/create-coupon", sellerAuth, createCoupon)
couponRouter.get("/get-coupons/", sellerAuth, getAllCoupons)

export default couponRouter