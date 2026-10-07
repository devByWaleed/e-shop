import mongoose from "mongoose"

// Creating order schema
const OrderSchema = new mongoose.Schema({
    cart: [
        {
            product: {
                type: Object,
            },
            quantity: {
                type: Number,
            },
            seller: {
                type: String,
            },
            isReviewed: {
                type: Boolean,
                default: false,
            },
            rating: {
                type: Number,
                default: 0,
            },
        }
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    platformFee: {
        type: Number,
        default: 0,
    },
    discountPrice: {
        type: Number,
        default: 0,
    },
    couponCode: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Processing",
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

OrderSchema.index({ "cart.seller": 1, createdAt: -1 });
OrderSchema.index({ user: 1, createdAt: -1 });

// Safety net: delete card orders that stayed unpaid for 3 days
// (the partial filter means PAID orders and COD orders are never touched)
OrderSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 3 * 24 * 60 * 60,
        partialFilterExpression: {
            "paymentInfo.type": "Online",
            "paymentInfo.status": "Pending"
        }
    }
);

// .model gets collection name & schema
const OrderModel = mongoose.models.order || mongoose.model("order", OrderSchema)

export default OrderModel