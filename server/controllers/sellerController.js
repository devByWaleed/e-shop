import SellerModel from "../models/Sellers.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";
import { uploadBufferToCloudinary, getCloudinaryPublicId } from "../config/cloudinary.js";


const isProd = process.env.NODE_ENV === "production";


const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

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

        const sellerToken = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("sellerToken", sellerToken, {
            httpOnly: true,
            secure: isProd,                     // must be true when sameSite is "none"
            sameSite: isProd ? "none" : "lax",  // "none" required for cross-site in prod
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/",
        })

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



// Seller login : /api/seller/login
export const sellerLogin = async (req, res) => {

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

        res.cookie("sellerToken", sellerToken, {
            httpOnly: true,
            secure: isProd,                     // must be true when sameSite is "none"
            sameSite: isProd ? "none" : "lax",  // "none" required for cross-site in prod
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/",               // IMPORTANT: available on all routes
        })

        return res.json({
            success: true,
            message: "Seller Logged In"
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
export const sellerLogout = async (req, res) => {

    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: isProd,                     // must be true when sameSite is "none"
            sameSite: isProd ? "none" : "lax",  // "none" required for cross-site in prod
            path: "/"
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

        const seller = await SellerModel.findOne({ email })

        if (!seller) {
            return res.json({
                success: false,
                message: "Seller not found"
            })
        }

        // Generating OTP, guaranteed 6 digits
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const resetToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' })
        res.cookie('resetToken', resetToken, { httpOnly: true, maxAge: 10 * 60 * 1000 })

        // Sending OTP reset email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: seller.email,
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

        const seller = await SellerModel.findOne({ email })

        if (!seller) {
            return res.json({
                success: false,
                message: "Seller not found"
            })
        }

        const decoded = jwt.verify(resetVerified, process.env.JWT_SECRET);

        if (!decoded.otpVerified || decoded.email !== email) {
            return res.json({ success: false, message: "Unauthorized. Please verify your OTP first." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        seller.password = hashedPassword

        await seller.save();

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


export const searchSellers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ success: true, sellers: [] });
        }

        const sellers = await SellerModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);

        return res.json({ success: true, sellers });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Update Seller Profile : /api/seller/update-seller-profile
export const updateSellerProfile = async (req, res) => {
    try {
        const sellerID = req.sellerID; // Settled by userAuth middleware
        const { name, email, password, phoneNumber, address, zipCode, description } = req.body;

        // 1. Validate fields
        if (!password) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "Password is required to update profile" });
        }

        // 2. Find seller & verify password
        const seller = await SellerModel.findById(sellerID);
        if (!seller) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "Seller not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, seller.password);
        if (!isPasswordMatch) {
            if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
            return res.json({ success: false, message: "Incorrect password. Verification failed." });
        }

        // 3. Handle Avatar File Updates
        if (req.file) {
            // Delete old asset from Cloudinary if it exists
            const oldPublicId = getCloudinaryPublicId(seller.avatar);
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId).catch((err) => console.log("Cloudinary destroy error:", err.message));
            }

            // Upload new file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
            });
            seller.avatar = result.secure_url;

            // Clean up temporary local upload file
            await fs.promises.unlink(req.file.path).catch(console.log);
        }

        // 4. Update structural details
        if (name) seller.name = name;
        if (email) seller.email = email;
        if (phoneNumber) seller.phoneNumber = phoneNumber;
        if (address) seller.address = address;
        if (zipCode) seller.zipCode = zipCode;
        if (description) seller.description = description;

        await seller.save();

        // Strip password out of response data
        const sellerData = await SellerModel.findById(sellerID).select("-password");

        return res.json({
            success: true,
            message: "Profile Updated Successfully",
            sellerData,
        });

    } catch (error) {
        console.log(error.message);
        if (req.file) await fs.promises.unlink(req.file.path).catch(console.log);
        return res.json({
            success: false,
            message: error.message
        });
    }
};