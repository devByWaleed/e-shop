import mongoose from "mongoose"

// Creating user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },
    email: {
        type: String, required: [true, "Please enter your email!"], unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    phoneNumber: {
        type: String,
        default: "",
        match: [/^[0-9+\-\s]{7,15}$|^$/, "Please enter a valid phone number"]
    },
    addresses: [
        {
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        }
    ],
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
    // Hashes of the active refresh tokens (one per logged-in device)
    refreshTokens: {
        type: [{ hash: String, expiresAt: Date }],
        select: false,
        default: [],
    },
})


// .model gets collection name & schema
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema)

export default UserModel