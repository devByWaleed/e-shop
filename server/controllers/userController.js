import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import fs from "fs";
import jwt from "jsonwebtoken"
import path from "path";
import { fileURLToPath } from "url"
import transporter from "../config/nodeMailer.js";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// Helper: create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

// User registration : /api/user/register
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

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
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
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

        const userData = {
            name,
            email,
            password: hashedPassword,
            avatar: fileUrl
        }

        const activationToken = createActivationToken(userData)
        const activationUrl = `${process.env.VITE_FRONTEND_URL}/activation/${activationToken}`

        // Sending OTP reset email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userData.email,
            subject: "Account Activation",
            text: `Hello ${userData.name}, please activate your account by clicking this link: ${activationUrl}`
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


// Account activation : /api/user/activation
export const activateAccount = async (req, res) => {
    try {
        const { activation_token } = req.body

        // Verify the token
        const userData = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        if (!userData) {
            return res.json({ success: false, message: "Invalid token" })
        }

        const { name, email, password, avatar } = userData

        // Check again if user was created in the meantime
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Now save the user
        const user = new UserModel({ name, email, password, avatar })
        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // false for localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/"
        })

        return res.json({
            success: true,
            user: { email: user.email, name: user.name, role: user.role }
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


// User login : /api/user/login
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

        // res.cookie("token", token, {
        //     httpOnly: true, secure: process.env.NODE_ENV === "production",
        //     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000
        // })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,           // false for localhost (HTTP)
            sameSite: "lax",         // Use "lax" not "strict" for cross-origin
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/",               // IMPORTANT: available on all routes
            domain: "localhost"      // Explicitly set domain
        })

        return res.json({
            success: true,
            user: { email: user.email, name: user.name }
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



// Get User Profile : /api/user/profile
export const getProfile = async (req, res) => {
    try {
        const userID = req.userID;
        const userData = await UserModel.findById(userID).select("-password")
        res.json({
            success: true,
            message: "Profile Fetched",
            userData,
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



// User logout : /api/user/logout
export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
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