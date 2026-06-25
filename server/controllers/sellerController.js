import SellerModel from "../models/Sellers.js";
import bcrypt from "bcryptjs"
import fs from "fs";
import jwt from "jsonwebtoken"
import path from "path";
import { fileURLToPath } from "url"
import transporter from "../config/nodeMailer.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// Helper: create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

// Seller registration : /api/seller/register
export const register = async (req, res) => {

    try {
        const { name, email, password, address, zipCode, phoneNumber } = req.body;

        if (!name || !email || !password) {
            // Delete uploaded file if validation fails
            if (req.file) {
                const filePath = path.join(__dirname, "../uploads", req.file.filename);
                await fs.promises.unlink(filePath).catch(console.log);
            }

            return res.json({
                success: false,
                message: "Missing Details"
            })
        }
        const sellerEmail = await SellerModel.findOne({ email })

        if (sellerEmail) {
            try {
                const fileName = req.file.filename
                const filePath = path.join(__dirname, "../uploads", fileName)
                await fs.promises.unlink(filePath)
            } catch (err) {
                console.log("Failed to delete file:", err.message)
            }

            return res.json({
                success: false,
                message: "User already existed"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const fileName = req.file.filename
        const fileUrl = path.join(fileName)

        const sellerData = {
            name,
            email,
            password: hashedPassword,
            avatar: fileUrl,
            address,
            zipCode,
            phoneNumber
        }

        const activationToken = createActivationToken(sellerData)
        const activationUrl = `${process.env.VITE_FRONTEND_URL}/seller-activation/${activationToken}`

        // Sending OTP reset email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: sellerData.email,
            subject: "Shop Activation",
            text: `Hello ${sellerData.name}, please activate your account by clicking this link to create your shop: ${activationUrl}`
        }

        await transporter.sendMail(mailOptions);
        // console.log(activationUrl);

        return res.json({
            success: true,
            message: "Please check your email to verify your account",
        })
    }

    catch (error) {
        console.log(error.message);

        // Delete uploaded file if error occurs
        if (req.file) {
            const filePath = path.join(__dirname, "../uploads", req.file.filename);
            await fs.promises.unlink(filePath).catch(console.log);
        }

        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Account activation : /api/seller/seller-activation
export const activateAccount = async (req, res) => {
    try {
        const { activation_token } = req.body

        // Verify the token
        const sellerData = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        if (!sellerData) {
            return res.json({ success: false, message: "Invalid token" })
        }

        const { name, email, password, avatar, address, zipCode, phoneNumber } = sellerData

        // Check again if seller was created in the meantime
        const existingSeller = await SellerModel.findOne({ email })
        if (existingSeller) {
            return res.json({ success: false, message: "Seller already exists" })
        }

        // Now save the seller
        const seller = new SellerModel({
            name,
            email,
            password,
            avatar,
            address,
            zipCode,
            phoneNumber
        })
        await seller.save()

        const sellerToken = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("sellerToken", sellerToken, {
            httpOnly: true,
            secure: false,  // false for localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/"
        })

        return res.json({
            success: true,
            seller: { email: seller.email, name: seller.name, role: seller.role }
        })

    } catch (error) {
        // Token expired or invalid
        if (error.name === "TokenExpiredError") {
            return res.json({
                success: false,
                message: "Activation link expired. Please register again."
            })
        }
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Seller login : /api/seller/login
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const seller = await SellerModel.findOne({ email })

        if (!seller) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }

        const sellerToken = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

        // res.cookie("token", token, {
        //     httpOnly: true, secure: process.env.NODE_ENV === "production",
        //     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000
        // })
        res.cookie("sellerToken", sellerToken, {
            httpOnly: true,
            secure: false,           // false for localhost (HTTP)
            sameSite: "lax",         // Use "lax" not "strict" for cross-origin
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/",               // IMPORTANT: available on all routes
            domain: "localhost"      // Explicitly set domain
        })

        return res.json({
            success: true,
            seller: { email: seller.email, name: seller.name }
        })
    }

    catch (error) {
        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Get Seller Shop : /api/seller/profile
export const sellerProfile = async (req, res) => {
    try {
        const sellerID = req.sellerID;
        const sellerData = await SellerModel.findById(sellerID).select("-password")
        res.json({
            success: true,
            message: "Profile Fetched",
            sellerData,
        })
    }

    catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}



// Seller logout : /api/seler/logout
export const logout = async (req, res) => {

    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({
            success: true,
            message: "Logged Out"
        })
    }

    catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}