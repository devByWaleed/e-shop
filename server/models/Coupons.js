import mongoose from "mongoose"

// Creating product schema
const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a valid coupon code identifier name!"],
        unique: true,
    },
    discountPercentage: {
        type: Number,
        required: [true, "Please configure the code value percentage discount metrics!"],
        min: [1, "Discount percentage must be at least 1%"],
        max: [100, "Discount percentage cannot exceed 100%"]
    },
    minAmount: {
        type: Number,
        default: null
    },
    maxAmount: {
        type: Number,
        default: null
    },
    shopId: {
        type: String,
    },
    selectedProduct: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });


// .model gets collection name & schema
const CouponModel = mongoose.models.coupon || mongoose.model("coupon", CouponSchema)

export default CouponModel