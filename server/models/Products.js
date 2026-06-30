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
        required: [true, "Please enter your product tags!"],
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
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})


// .model gets collection name & schema
const ProductModel = mongoose.models.product || mongoose.model("product", ProductSchema)

export default ProductModel