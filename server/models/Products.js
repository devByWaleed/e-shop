import mongoose from "mongoose"

// Creating product schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your product name!"]
    },
    description: {
        type: Array,
        required: [true, "Please enter your product description!"],
    },
    category: {
        type: String,
        required: [true, "Please enter your product category!"],
    },
    tags: {
        type: String,
    },
    originalPrice: {
        type: Number,
    },
    discountPrice: {
        type: Number,
        required: [true, "Please enter your product price!"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter your product stock!"],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            urls: {
                type: Array,
                required: true,
            },
        },
    ],
    reviews: [
        {
            user: {
                type: Object,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            productId: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            }
        },
    ],
    ratings: {
        type: Number,
    },
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    sold_out: {
        type: Number,
        default: 0,
    },

    // --- Best Deals / Featured: admin-controlled, not seller-set ---
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isBestDeal: {
        type: Boolean,
        default: false,
    },

    // --- Event / Flash Sale: seller-controlled, time-bound ---
    isEvent: {
        type: Boolean,
        default: false,
    },
    eventStartsAt: {
        type: Date,
    },
    eventEndsAt: {
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

})


// .model gets collection name & schema
const ProductModel = mongoose.models.product || mongoose.model("product", ProductSchema)

export default ProductModel