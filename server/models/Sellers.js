import mongoose from "mongoose"

// Creating user schema
const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },
    email: {
        type: String, required: [true, "Please enter your email!"], unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        match: [/^[0-9+\-\s]{7,15}$/, "Please enter a valid phone number"]
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "seller",
    },
    zipCode: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    // Old accounts have no status, and that counts as "active"
    status: {
        type: String,
        enum: ["active", "suspended", "closed", "deleted"],
        default: "active",
    },
    statusReason: {
        type: String,
        default: "",
    },
    statusChangedAt: {
        type: Date,
    },
    // Set when the shop is closed: the earliest day it can be removed permanently
    purgeAfter: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },

    resetPasswordToken: String,
    resetPasswordTime: Date
})


// .model gets collection name & schema
const SellerModel = mongoose.models.seller || mongoose.model("seller", SellerSchema)

export default SellerModel