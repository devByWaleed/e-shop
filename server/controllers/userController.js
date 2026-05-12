import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import path from "path";
// import transporter from "../config/nodeMailer.js";



// User registration : /api/user/register
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const fileName = req.file.filename
        const fileUrl = path.join(fileName)

        const user = new UserModel({ name, email, password: hashedPassword, avatar: fileUrl })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,     // prevent Js to access cookie
            secure: process.env.NODE_ENV === "production",      // Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",        // CSRF production
            maxAge: 7 * 24 * 3600 * 1000        // Cookie expiration time
        })

        return res.json({
            success: true,
            user: { email: user.email, name: user.name }
        })
    }

    catch (error) {
        console.log(error.message);
        return res.json({
            success: false, message: error.message
        })
    }
}