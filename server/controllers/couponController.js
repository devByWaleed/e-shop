import CouponModel from "../models/Coupons.js";

// Create Discount Coupon : /api/coupon/create-coupon
export const createCoupon = async (req, res) => {
    try {
        const { name, discountPercentage, minAmount, maxAmount, selectedProduct, shopId } = req.body;

        // Basic Validation for required fields from the frontend body payload
        if (!name || !discountPercentage) {
            return res.status(400).json({
                success: false,
                message: "Coupon name and discount percentage are required!"
            });
        }

        // Check if a coupon with the exact same name already exists (since 'name' is unique)
        const isCouponExists = await CouponModel.findOne({ name: name.trim() });
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
            shopId: shopId
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


// Get All Coupons : /api/coupon/get-coupons
export const getAllCoupons = async (req, res) => {
    try {
        const couponCodes = await CouponModel.find({ shopId: req.params.id });

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
        const couponID = req.params.id

        // Get the event data
        const coupon = await CouponModel.findById(couponID)

        if (!coupon) {
            return res.json({
                success: false,
                message: "Event not found"
            });
        }


        // Delete the coupon
        await CouponModel.findByIdAndDelete(couponID);

        res.json({
            success: true,
            message: "Coupon deleted successfully"
        });


    } catch (error) {
        console.log("Error inside createProduct:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}