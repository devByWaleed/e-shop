import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";
import { getCloudinaryPublicId } from "../config/cloudinary.js";


// Helper: create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

// Helper: safely remove the local temp file multer created
const cleanupTempFile = async (filePath) => {
    if (!filePath) return;
    await fs.promises.unlink(filePath).catch((err) => {

    });
}

// User registration : /api/user/register
export const register = async (req, res) => {

    let avatarUrl = null; // only gets set once the Cloudinary upload actually succeeds

    try {
        const { name, email, password } = req.body;

        // Validate required fields first — nothing has touched Cloudinary yet
        if (!name || !email || !password) {
            await cleanupTempFile(req.file?.path);
            return res.json({
                success: false,
                message: "Missing Details"
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
            await cleanupTempFile(req.file.path);
            return res.json({
                success: false,
                message: "User already existed"
            })
        }

        // All validation passed — safe to upload now
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars"
        });
        avatarUrl = result.secure_url;

        // Temp file is no longer needed once it's on Cloudinary
        await cleanupTempFile(req.file.path);

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


        // Always clean up the temp file if it's still sitting around
        await cleanupTempFile(req.file?.path);

        // If the Cloudinary upload already succeeded before something else failed
        // (e.g. sendMail), remove the orphaned asset
        if (avatarUrl) {
            const publicId = getCloudinaryPublicId(avatarUrl);
            await cloudinary.uploader.destroy(publicId).catch((err) => {

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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/"
        })

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
            message: "User Logged In"
        })
    }

    catch (error) {


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

        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Update User Profile : /api/user/update-profile
export const updateProfile = async (req, res) => {
    try {
        const userID = req.userID; // Settled by userAuth middleware
        const { name, email, password, phoneNumber, address1, address2, zipCode, country, city } = req.body;

        // 1. Validate fields
        if (!password) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "Password is required to update profile" });
        }

        // 2. Find user & verify password
        const user = await UserModel.findById(userID);
        if (!user) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "Incorrect password. Verification failed." });
        }

        // 3. Handle Avatar File Updates
        if (req.file) {
            // Delete old asset from Cloudinary if it exists
            const oldPublicId = getCloudinaryPublicId(user.avatar);
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId).catch((err) => 
            }

            // Upload new file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
            });
            user.avatar = result.secure_url;

            // Clean up temporary local upload file
            await fs.promises.unlink(req.file.path).catch(console.log);
        }

        // 4. Update structural details
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Sync structure with schema address dictionary 
        const updatedAddress = {
            address1: address1 || "",
            address2: address2 || "",
            zipCode: zipCode ? Number(zipCode) : 0,
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

        // Strip password out of response data
        const userData = await UserModel.findById(userID).select("-password");

        return res.json({
            success: true,
            message: "Profile Updated Successfully",
            userData,
        });

    } catch (error) {

        if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
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
        return res.json({
            success: false,
            message: "Email is required"
        })
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // Generating OTP, guaranteed 6 digits
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const resetToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' })
        res.cookie('resetToken', resetToken, { httpOnly: true, maxAge: 10 * 60 * 1000 })

        // Sending OTP reset email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP Is ${otp}. Reset your password using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP send to your email" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Verify Reset OTP : /api/user/verify-reset-otp
export const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    const { resetToken } = req.cookies;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    if (!resetToken) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            return res.json({ success: false, message: "Invalid request" });
        }

        if (decoded.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP. Please try again." });
        }

        // OTP is correct — issue a verified token so reset-password knows OTP was checked
        const verifiedToken = jwt.sign(
            { email, otpVerified: true },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.cookie('resetVerified', verifiedToken, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        // Clear the OTP token — it's been used
        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "OTP verified" });

    } catch (error) {
        // jwt.verify throws if token is expired
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }
}


// Reset user password : /api/user/reset-password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const { resetVerified } = req.cookies;

    if (!email || !newPassword) {
        return res.json({
            success: false,
            message: "Email,OTP, new password is required"
        })
    }

    if (!resetVerified) {
        return res.json({
            success: false,
            message: "OTP not verified. Please start over."
        });
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const decoded = jwt.verify(resetVerified, process.env.JWT_SECRET);

        if (!decoded.otpVerified || decoded.email !== email) {
            return res.json({ success: false, message: "Unauthorized. Please verify your OTP first." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword

        await user.save();

        // Clean up the verified cookie
        res.clearCookie('resetVerified', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "Password has been reset successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
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


export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ success: true, users: [] });
        }

        const users = await UserModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};