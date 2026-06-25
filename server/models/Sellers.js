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
        required: true
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
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
})


// .model gets collection name & schema
const SellerModel = mongoose.models.seller || mongoose.model("seller", SellerSchema)

export default SellerModel