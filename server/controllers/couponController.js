import CouponModel from "../models/Coupons.js";

// Create Discount Coupon : /api/coupon/create-coupon
export const createCoupon = async (req, res) => {
    try {
        const { name, discountPercentage, minAmount, maxAmount, selectedProduct } = req.body;

        // Basic Validation for required fields from the frontend body payload
        if (!name || !discountPercentage) {
            return res.status(400).json({
                success: false,
                message: "Coupon name and discount percentage are required!"
            });
        }

        // Check if a coupon with the exact same name already exists (since 'name' is unique)
        const isCouponExists = await CouponModel.findOne({ name: name.trim(), shopId: req.sellerID });

        if (isCouponExists) {
            return res.status(400).json({
                success: false,
                message: "A coupon code with this name already exists!"
            });
        }

        // Construct and save the new coupon matching the fields provided by your schema layout
        const newCoupon = new CouponModel({
            name: name.trim(),
            discountPercentage: Number(discountPercentage),
            minAmount: minAmount ? Number(minAmount) : null,
            maxAmount: maxAmount ? Number(maxAmount) : null,
            selectedProduct: selectedProduct || null,
            shopId: req.sellerID
        });

        await newCoupon.save();

        // Send back a successful JSON response matching your frontend's requirements
        return res.status(201).json({
            success: true,
            message: "Coupon code created successfully!",
            coupon: newCoupon
        });

    } catch (error) {
        console.error("Error inside createCoupon controller:", error.message);

        // Handle MongoDB unique validation or criteria constraint crashes gracefully
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error occurred while creating coupon."
        });
    }
};


// Get All Coupons : /api/coupon/get-coupon-value
export const getCouponByName = async (req, res) => {
    try {
        const filter = { name: String(req.params.name).trim() }
        // If the frontend sends ?shopId=..., only match that shop's coupon
        if (req.query.shopId) filter.shopId = String(req.query.shopId)

        const couponName = await CouponModel.findOne(filter)

        return res.status(200).json({
            success: true,
            couponName
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error occurred while creating coupon."
        });
    }
}



// Get All Coupons : /api/coupon/get-coupons
export const getAllCoupons = async (req, res) => {
    try {
        const couponCodes = await CouponModel.find({ shopId: req.sellerID });

        return res.json({
            success: true,
            couponCodes
        });
    } catch (error) {
        console.error("Error inside createCoupon controller:", error.message);

        // Handle MongoDB unique validation or criteria constraint crashes gracefully
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error occurred while creating coupon."
        });
    }
}


// Delete Coupon : /api/coupon/delete-coupon
export const deleteCoupon = async (req, res) => {
    try {
        // Delete only if the coupon belongs to the logged-in seller
        const coupon = await CouponModel.findOneAndDelete({
            _id: req.params.id,
            shopId: req.sellerID
        });

        if (!coupon) {
            return res.json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.json({
            success: true,
            message: "Coupon deleted successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}