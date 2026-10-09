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
        required: [true, "Please enter your product discount!"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter your product stock!"],
    },
    images: [
        {
            type: String
        },
    ],
    reviews: [
        {
            user: {
                _id: { type: String },
                name: { type: String },
                avatar: { type: String },
            },
            rating: {
                type: Number
            },
            comment: {
                type: String
            },
            productId: {
                type: String
            },
        }
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
    soldOut: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

ProductSchema.index({ shopId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: "text", tags: "text" });   // for fast text search later

// .model gets collection name & schema
const ProductModel = mongoose.models.product || mongoose.model("product", ProductSchema)

export default ProductModel