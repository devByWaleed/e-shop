import express from "express"
import { createCoupon, getAllCoupons, deleteCoupon, getCouponByName } from "../controllers/couponController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const couponRouter = express.Router();

couponRouter.post("/create-coupon", sellerAuth, createCoupon)
couponRouter.get("/get-coupons/:id", sellerAuth, getAllCoupons)
couponRouter.get("/get-coupon-value/:name", getCouponByName)
couponRouter.delete("/delete-coupon/:id", deleteCoupon)

export default couponRouter