import mongoose from "mongoose"

// Creating product schema
const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your event product name!"]
    },
    description: {
        type: Array,
        required: [true, "Please enter your event product description!"],
    },
    category: {
        type: String,
        required: [true, "Please enter your event product category!"],
    },
    start_Date: {
        type: Date,
        required: true
    },
    finish_Date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "running"
    },
    tags: {
        type: String,
    },
    originalPrice: {
        type: Number,
    },
    discountPrice: {
        type: Number,
        required: [true, "Please enter your event product discount!"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter your event product stock!"],
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
    soldOut: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})


// .model gets collection name & schema
const EventModel = mongoose.models.event || mongoose.model("event", EventSchema)

export default EventModel