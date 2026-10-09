import SellerModel from "../models/Sellers.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";
import { uploadBufferToCloudinary, getCloudinaryPublicId } from "../config/cloudinary.js";
import { signAccessToken, accessMaxAge, cookieBase } from "../config/tokens.js";
import { v2 as cloudinary } from 'cloudinary';
import ProductModel from "../models/Products.js";
import EventModel from "../models/Events.js";


const isProd = process.env.NODE_ENV === "production";

const RESET_SECRET = process.env.RESET_SECRET
const hashOtp = (email, otp) =>
    crypto.createHmac("sha256", RESET_SECRET).update(`${email}:${otp}`).digest("hex")


const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}


// Login cookie lives this many days (one place to change it)
const LOGIN_DAYS = 365;
const LOGIN_MAX_AGE = LOGIN_DAYS * 24 * 60 * 60 * 1000;

// Used by login, logout and the password reset cookies

const signLoginToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: `${LOGIN_DAYS}d` });


// Seller registration : /api/seller/register
export const sellerRegister = async (req, res) => {

    let avatarUrl = null;

    try {
        const { name, email, password, address, zipCode, phoneNumber } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        if (!req.file) {
            return res.json({
                success: false,
                message: "Avatar image is required"
            })
        }

        const sellerEmail = await SellerModel.findOne({ email })

        if (sellerEmail) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }

        const result = await uploadBufferToCloudinary(req.file.buffer, {
            folder: "Zenvio Media"
        });
        avatarUrl = result.secure_url;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sellerData = {
            name,
            email,
            password: hashedPassword,
            avatar: avatarUrl,
            address,
            zipCode,
            phoneNumber
        }

        const activationToken = createActivationToken(sellerData)
        const activationUrl = `${process.env.VITE_FRONTEND_URL}/seller-activation/${activationToken}`

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: sellerData.email,
            subject: "Shop Activation",
            text: `Hello ${sellerData.name}, please activate your account by clicking this link to create your shop: ${activationUrl}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Please check your email to verify your account",
        })
    }

    catch (error) {
        console.log(error.message);

        if (avatarUrl) {
            const publicId = getCloudinaryPublicId(avatarUrl);
            await cloudinary.uploader.destroy(publicId).catch((err) => {
                console.log("Failed to delete cloudinary asset:", err.message);
            });
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

        const sellerData = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        if (!sellerData) {
            return res.json({ success: false, message: "Invalid token" })
        }

        const { name, email, password, avatar, address, zipCode, phoneNumber } = sellerData

        const existingSeller = await SellerModel.findOne({ email })
        if (existingSeller) {
            return res.json({ success: false, message: "Seller already exists" })
        }

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

        res.cookie("sellerToken", signLoginToken(seller), { ...cookieBase, maxAge: LOGIN_MAX_AGE })

        return res.json({
            success: true,
            seller: { email: seller.email, name: seller.name, role: seller.role, id: seller._id }
        })

    } catch (error) {
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


// Seller login : /api/seller/seller-login
export const sellerLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const seller = await SellerModel.findOne({ email }).select("+password")

        const isMatch = seller ? await bcrypt.compare(password, seller.password) : false;

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            })
        }

        res.cookie("sellerToken", signLoginToken(seller), { ...cookieBase, maxAge: LOGIN_MAX_AGE })

        // SellerLogin.jsx reads data.seller.id to open the shop page
        return res.json({
            success: true,
            message: "Seller Logged In",
            seller: { email: seller.email, name: seller.name, role: seller.role, id: seller._id }
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



// Seller logout : /api/seller/seller-logout
export const sellerLogout = async (req, res) => {

    try {
        res.clearCookie("sellerToken", cookieBase)

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


export const getSellerInfo = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // Check if it's a custom ID or MongoDB ObjectId
        let seller;
        if (sellerId && sellerId.includes('_')) {
            // Try to find by custom ID field
            seller = await SellerModel.findOne({ customId: sellerId }).select("name avatar");
        } else {
            seller = await SellerModel.findById(sellerId).select("name avatar");
        }

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        return res.status(200).json({
            success: true,
            seller
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Escape regex special characters so user input cannot become a regex attack
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchSellers = async (req, res) => {
    try {
        // q must be a plain string (blocks ?q[$ne]=x style object input)
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        if (q.length < 2 || q.length > 50) {
            return res.json({ success: true, sellers: [] });
        }

        const safe = escapeRegex(q);
        const sellers = await SellerModel.find({
            $or: [
                { name: { $regex: safe, $options: "i" } },
                { email: { $regex: safe, $options: "i" } }
            ]
        }).select("name email avatar").limit(10);

        return res.json({ success: true, sellers });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Update seller profile : /api/seller/update-seller-profile
export const updateSellerProfile = async (req, res) => {
    let newPublicId = null;

    try {
        const sellerID = req.sellerID; // Settled by sellerAuth middleware
        const { name, email, password, phoneNumber, address, zipCode, description } = req.body;

        if (!password) {
            return res.json({ success: false, message: "Password is required to update profile" });
        }

        const seller = await SellerModel.findById(sellerID).select("+password");
        if (!seller) {
            return res.json({ success: false, message: "Seller not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, seller.password);
        if (!isPasswordMatch) {
            return res.json({ success: false, message: "Incorrect password. Verification failed." });
        }

        if (email && email !== seller.email) {
            const emailTaken = await SellerModel.findOne({ email });
            if (emailTaken) {
                return res.json({ success: false, message: "This email is already in use" });
            }
        }

        let oldPublicId = null;
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, { folder: "Zenvio Media" });
            newPublicId = result.public_id;
            oldPublicId = getCloudinaryPublicId(seller.avatar);
            seller.avatar = result.secure_url;
        }

        if (name) seller.name = name;
        if (email) seller.email = email;
        if (phoneNumber) seller.phoneNumber = phoneNumber;
        if (address) seller.address = address;
        if (zipCode) seller.zipCode = zipCode;
        if (description) seller.description = description;

        await seller.save();

        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId).catch((err) => console.log("Cloudinary destroy error:", err.message));
        }

        const sellerData = await SellerModel.findById(sellerID).select("-password");
        const shopCopy = {
            shop: {
                id: seller._id,
                name: seller.name,
                avatar: seller.avatar
            }
        };

        await ProductModel.updateMany({ shopId: String(seller._id) }, { $set: shopCopy });
        await EventModel.updateMany({ shopId: String(seller._id) }, { $set: shopCopy });

        return res.json({
            success: true,
            message: "Profile Updated Successfully",
            sellerData,
        });

    } catch (error) {
        console.log(error.message);

        if (newPublicId) {
            await cloudinary.uploader.destroy(newPublicId).catch(() => { });
        }

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// Password reset OTP : /api/user/send-reset-otp
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {
        const user = await SellerModel.findOne({ email })

        // Same answer whether or not the email exists
        if (!user) {
            return res.json({ success: true, message: "If this email is registered, an OTP has been sent" })
        }

        // Secure random 6 digit code (Math.random is predictable)
        const otp = String(crypto.randomInt(100000, 1000000))

        const resetToken = jwt.sign(
            { email, otpHash: hashOtp(email, otp) },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        )
        res.cookie("sellerResetToken", resetToken, { ...cookieBase, maxAge: 10 * 60 * 1000 })

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP Is ${otp}. Reset your password using this OTP.`
        });

        return res.json({ success: true, message: "OTP send to your email" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Verify Reset OTP : /api/user/verify-reset-otp
export const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    const { sellerResetToken } = req.cookies;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    if (!sellerResetToken) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }

    try {
        const decoded = jwt.verify(sellerResetToken, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            return res.json({ success: false, message: "Invalid request" });
        }

        // Compare the hash of what the user typed with the hash stored in the token
        const expected = Buffer.from(decoded.otpHash, "hex");
        const given = Buffer.from(hashOtp(email, String(otp)), "hex");
        if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
            return res.json({ success: false, message: "Invalid OTP. Please try again." });
        }

        const verifiedToken = jwt.sign(
            { email, otpVerified: true },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("sellerResetVerified", verifiedToken, { ...cookieBase, maxAge: 10 * 60 * 1000 });
        res.clearCookie("sellerResetToken", cookieBase);

        return res.json({ success: true, message: "OTP verified" });

    } catch (error) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }
}


// Reset user password : /api/user/reset-password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const { sellerResetVerified } = req.cookies;

    if (!email || !newPassword) {
        return res.json({ success: false, message: "Email and new password are required" })
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters" })
    }

    if (!sellerResetVerified) {
        return res.json({ success: false, message: "OTP not verified. Please start over." });
    }

    try {
        const decoded = jwt.verify(sellerResetVerified, process.env.JWT_SECRET);

        if (!decoded.otpVerified || decoded.email !== email) {
            return res.json({ success: false, message: "Unauthorized. Please verify your OTP first." });
        }

        const seller = await SellerModel.findOne({ email })

        if (!seller) {
            return res.json({ success: false, message: "Unable to reset password" })
        }

        seller.password = await bcrypt.hash(newPassword, 10);
        await seller.save();

        // The password changed: log this account out on every device
        await SellerModel.updateOne({ _id: seller._id }, { $set: { refreshTokens: [] } });


        res.clearCookie("sellerResetVerified", cookieBase);
        return res.json({ success: true, message: "Password has been reset successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}