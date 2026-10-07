import mongoose from "mongoose"

// Creating product schema
const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a valid coupon code identifier name!"],
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
    expiresAt: {
        type: Date,
        default: null      // empty means the coupon never expires
    },
}, { timestamps: true });

// A name must be unique only inside one shop
CouponSchema.index({ shopId: 1, name: 1 }, { unique: true });

// .model gets collection name & schema
const CouponModel = mongoose.models.coupon || mongoose.model("coupon", CouponSchema)

export default CouponModel