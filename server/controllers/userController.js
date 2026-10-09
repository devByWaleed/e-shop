import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";
import { uploadBufferToCloudinary, getCloudinaryPublicId } from "../config/cloudinary.js";
import { cookieBase } from "../config/tokens.js";
import { v2 as cloudinary } from 'cloudinary';
import crypto from "crypto";



const RESET_SECRET = process.env.RESET_SECRET
const hashOtp = (email, otp) =>
    crypto.createHmac("sha256", RESET_SECRET).update(`${email}:${otp}`).digest("hex")


const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

const isProd = process.env.NODE_ENV === "production";

// Login cookie lives this many days (one place to change it)
const LOGIN_DAYS = 365;
const LOGIN_MAX_AGE = LOGIN_DAYS * 24 * 60 * 60 * 1000;

// Used by login, logout and the password reset cookies


const signLoginToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: `${LOGIN_DAYS}d` });


// User registration : /api/user/register
export const register = async (req, res) => {

    let avatarUrl = null;

    try {
        const { name, email, password } = req.body;

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

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }

        // Upload straight from the in-memory buffer — no temp file involved
        const result = await uploadBufferToCloudinary(req.file.buffer, {
            folder: "Zenvio Media"
        });
        avatarUrl = result.secure_url;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            password: hashedPassword,
            avatar: avatarUrl
        }

        const activationToken = createActivationToken(userData)
        const activationUrl = `${process.env.VITE_FRONTEND_URL}/activation/${activationToken}`

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userData.email,
            subject: "Account Activation",
            text: `Hello ${userData.name}, please activate your account by clicking this link: ${activationUrl}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Please check your email to verify your account",
        })
    }

    catch (error) {
        console.log(error.message);

        // If the Cloudinary upload already succeeded before something else failed
        // (e.g. sendMail), remove the orphaned asset
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



// Account activation : /api/user/activation
export const activateAccount = async (req, res) => {
    try {
        const { activation_token } = req.body

        const userData = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        if (!userData) {
            return res.json({ success: false, message: "Invalid token" })
        }

        const { name, email, password, avatar } = userData

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        const user = new UserModel({ name, email, password, avatar })
        await user.save()

        res.cookie("token", signLoginToken(user), { ...cookieBase, maxAge: LOGIN_MAX_AGE })

        return res.json({
            success: true,
            user: { email: user.email, name: user.name, role: user.role }
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

        // +password is needed because the field is hidden by default
        const user = await UserModel.findOne({ email }).select("+password")

        const isMatch = user ? await bcrypt.compare(password, user.password) : false;

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            })
        }

        res.cookie("token", signLoginToken(user), { ...cookieBase, maxAge: LOGIN_MAX_AGE })

        return res.json({
            success: true,
            message: "User Logged In"
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


// Update User Profile : /api/user/update-profile
export const updateProfile = async (req, res) => {
    let newPublicId = null;   // remembers a fresh upload so it can be removed if saving fails

    try {
        const userID = req.userID; // Settled by userAuth middleware
        const { name, email, password, phoneNumber, address1, address2, zipCode, country, city } = req.body;

        // 1. Validate fields
        if (!password) {
            return res.json({ success: false, message: "Password is required to update profile" });
        }

        // 2. Find user & verify password (+password because the field is hidden by default after Fix 21)
        const user = await UserModel.findById(userID).select("+password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({ success: false, message: "Incorrect password. Verification failed." });
        }

        // 2b. If the email changes, make sure nobody else already uses it
        if (email && email !== user.email) {
            const emailTaken = await UserModel.findOne({ email });
            if (emailTaken) {
                return res.json({ success: false, message: "This email is already in use" });
            }
        }

        // 3. Avatar: upload from memory, delete the old image only after saving worked
        let oldPublicId = null;
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, { folder: "Zenvio Media" });
            newPublicId = result.public_id;
            oldPublicId = getCloudinaryPublicId(user.avatar);
            user.avatar = result.secure_url;
        }

        // 4. Update structural details
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Sync structure with schema address dictionary
        const updatedAddress = {
            address1: address1 || "",
            address2: address2 || "",
            zipCode: zipCode ? String(zipCode) : "",
            country: country || "",
            city: city || "",
            addressType: "Default"
        };

        if (user.addresses && user.addresses.length > 0) {
            user.addresses[0] = updatedAddress;
        } else {
            user.addresses = [updatedAddress];
        }

        await user.save();

        // Saving worked, so the old image can go
        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId).catch((err) => console.log("Cloudinary destroy error:", err.message));
        }

        // Strip password out of response data
        const userData = await UserModel.findById(userID).select("-password");

        return res.json({
            success: true,
            message: "Profile Updated Successfully",
            userData,
        });

    } catch (error) {
        console.log(error.message);

        // Saving failed after a new upload: remove the new image so it does not become an orphan
        if (newPublicId) {
            await cloudinary.uploader.destroy(newPublicId).catch(() => { });
        }

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// User logout : /api/user/logout
export const logout = async (req, res) => {

    try {
        res.clearCookie("token", cookieBase)

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


export const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if it's a custom ID (like admin_123) or MongoDB ObjectId
        let user;
        if (userId && userId.includes('_')) {
            // Try to find by custom ID field if you have one
            user = await UserModel.findOne({ customId: userId }).select("name avatar");
        } else {
            user = await UserModel.findById(userId).select("name avatar");
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
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

export const searchUsers = async (req, res) => {
    try {
        // q must be a plain string (blocks ?q[$ne]=x style object input)
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        if (q.length < 2 || q.length > 50) {
            return res.json({ success: true, users: [] });
        }

        const safe = escapeRegex(q);
        const users = await UserModel.find({
            $or: [
                { name: { $regex: safe, $options: "i" } },
                { email: { $regex: safe, $options: "i" } }
            ]
        }).select("name email avatar").limit(10);

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Password reset OTP : /api/user/send-reset-otp
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {
        const user = await UserModel.findOne({ email })

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
        res.cookie("userResetToken", resetToken, { ...cookieBase, maxAge: 10 * 60 * 1000 })

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
    const { userResetToken } = req.cookies;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    if (!userResetToken) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }

    try {
        const decoded = jwt.verify(userResetToken, process.env.JWT_SECRET);

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

        res.cookie("userResetVerified", verifiedToken, { ...cookieBase, maxAge: 10 * 60 * 1000 });
        res.clearCookie("userResetToken", cookieBase);

        return res.json({ success: true, message: "OTP verified" });

    } catch (error) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }
}


// Reset user password : /api/user/reset-password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const { userResetVerified } = req.cookies;

    if (!email || !newPassword) {
        return res.json({ success: false, message: "Email and new password are required" })
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters" })
    }

    if (!userResetVerified) {
        return res.json({ success: false, message: "OTP not verified. Please start over." });
    }

    try {
        const decoded = jwt.verify(userResetVerified, process.env.JWT_SECRET);

        if (!decoded.otpVerified || decoded.email !== email) {
            return res.json({ success: false, message: "Unauthorized. Please verify your OTP first." });
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Unable to reset password" })
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // The password changed: log this account out on every device
        await UserModel.updateOne({ _id: user._id }, { $set: { refreshTokens: [] } });

        res.clearCookie("userResetVerified", cookieBase);
        return res.json({ success: true, message: "Password has been reset successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}