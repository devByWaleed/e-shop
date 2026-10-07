import { getCloudinaryPublicId } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/Users.js";
import SellerModel from "../models/Sellers.js";
import ProductModel from "../models/Products.js";
import EventModel from "../models/Events.js";
import OrderModel from "../models/Orders.js";
import CouponModel from "../models/Coupons.js";
import ConversationModel from "../models/Conversations.js";
import MessageModel from "../models/Messages.js";
import jwt from "jsonwebtoken"
import { signAccessToken, verifyAccessToken, accessMaxAge, cookieBase } from "../config/tokens.js";


// Orders that are not finished yet. EDIT to match the statuses your sellers really use.
const OPEN_ORDER_STATUSES = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Processing refund",
];

// Cloudinary deletes at most 100 images per request
const chunk = (list, size) => {
    const parts = [];
    for (let i = 0; i < list.length; i += size) {
        parts.push(list.slice(i, i + size));
    }
    return parts;
};

// Deletes images from Cloudinary; a failure here is only logged and never stops the delete
const deleteCloudinaryImages = async (urls) => {
    const publicIds = urls.map(getCloudinaryPublicId).filter(Boolean);

    for (const batch of chunk(publicIds, 100)) {
        try {
            await cloudinary.api.delete_resources(batch);
        } catch (error) {
            console.error("Cloudinary bulk delete failed:", error.message);
        }
    }
};

// Deletes all the chats of one person (conversations and their messages)
const deleteChatsOf = async (memberId) => {
    const conversations = await ConversationModel.find({ members: memberId }).select("_id");
    const conversationIds = conversations.map((conversation) => String(conversation._id));

    await MessageModel.deleteMany({ conversationID: { $in: conversationIds } });
    await ConversationModel.deleteMany({ members: memberId });
};


// Admin login : /api/admin/admin-login
export const adminLogin = async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    try {
        const { email, password } = req.body;

        // Check credentials against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            // Create admin user object with role
            const adminUser = {
                id: process.env.ADMIN_ID || "admin_main",
                email: process.env.ADMIN_EMAIL,
                role: "admin" // Set role as "admin"
            };

            const adminToken = signAccessToken("admin", adminUser.id);

            res.cookie("adminToken", adminToken, { ...cookieBase, maxAge: accessMaxAge("admin") });


            // Return success response with admin data (excluding sensitive info)
            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                admin: {
                    id: adminUser.id,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        } else {
            // Invalid credentials
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};



// Admin Verify : /api/admin//verify-admin
export const verifyAdmin = async (req, res) => {
    try {
        const adminToken = req.cookies?.adminToken;

        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        const tokenDecode = verifyAccessToken("admin", adminToken);

        if (tokenDecode.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized as admin"
            });
        }

        // Return admin info (without sensitive data)
        return res.status(200).json({
            success: true,
            admin: {
                id: tokenDecode.id,
                email: process.env.ADMIN_EMAIL,
                role: tokenDecode.role
            }
        });
    } catch (error) {
        console.error("Verify admin error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};



// Get All Users : /api/admin/admin-users
export const adminUsers = async (req, res) => {
    try {
        const allUsers = await UserModel.find({})

        res.json({
            success: true,
            allUsers
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Delete Specific User : /api/admin/delete-user-by-id/:id
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id

        const userDetail = await UserModel.findById(id)

        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // 1. Do not delete a buyer who still has unfinished orders
        const openOrders = await OrderModel.countDocuments({
            user: id,
            status: { $in: OPEN_ORDER_STATUSES }
        })

        if (openOrders > 0) {
            return res.json({
                success: false,
                message: `This user has ${openOrders} unfinished order(s). Finish or cancel them first.`
            })
        }

        // 2. Remove the user's reviews and fix the average rating of those products
        const reviewedProducts = await ProductModel.find({ "reviews.user._id": id })

        for (const product of reviewedProducts) {
            product.reviews = product.reviews.filter((review) => String(review.user?._id) !== String(id))
            product.ratings = product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / product.reviews.length
                : 0
            await product.save({ validateBeforeSave: false })
        }

        // 3. Delete the user's chats, then the user
        await deleteChatsOf(id)
        await UserModel.findByIdAndDelete(id)

        // 4. Avatar last
        if (userDetail.avatar) {
            await deleteCloudinaryImages([userDetail.avatar])
        }

        return res.json({
            success: true,
            message: "User Deleted Successfully",
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}



// Get All Sellers : /api/admin/admin-sellers
export const adminSellers = async (req, res) => {
    try {
        const allSellers = await SellerModel.find({})

        res.json({
            success: true,
            allSellers
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Delete Specific Seller : /api/admin/delete-seller-by-id/:id
export const deleteSeller = async (req, res) => {
    try {
        const id = req.params.id

        const sellerDetail = await SellerModel.findById(id)

        if (!sellerDetail) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            })
        }

        // 1. Do not delete a seller who still has unfinished orders
        const openOrders = await OrderModel.countDocuments({
            "cart.seller": id,
            status: { $in: OPEN_ORDER_STATUSES }
        })

        if (openOrders > 0) {
            return res.json({
                success: false,
                message: `This seller has ${openOrders} unfinished order(s). Finish or cancel them first.`
            })
        }

        // 2. Remember every image that must be removed from Cloudinary
        const [products, events] = await Promise.all([
            ProductModel.find({ shopId: id }).select("images"),
            EventModel.find({ shopId: id }).select("images"),
        ])

        const imageUrls = [
            sellerDetail.avatar,
            ...products.flatMap((product) => product.images || []),
            ...events.flatMap((event) => event.images || []),
        ].filter(Boolean)

        // 3. Delete the seller's data (finished orders are kept as history)
        await Promise.all([
            ProductModel.deleteMany({ shopId: id }),
            EventModel.deleteMany({ shopId: id }),
            CouponModel.deleteMany({ shopId: id }),
            deleteChatsOf(id),
        ])

        await SellerModel.findByIdAndDelete(id)

        // 4. Images last: if Cloudinary fails, the delete itself still worked
        await deleteCloudinaryImages(imageUrls)

        return res.json({
            success: true,
            message: "Seller Deleted Successfully",
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}



// Get All Products : /api/admin/admin-products
export const adminProducts = async (req, res) => {
    try {
        const allProducts = await ProductModel.find({})

        res.json({
            success: true,
            allProducts
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Get All Events : /api/admin/admin-events
export const adminEvents = async (req, res) => {
    try {
        const allEvents = await EventModel.find({})

        res.json({
            success: true,
            allEvents
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}


// Get All Orders : /api/admin/admin-orders
export const adminOrders = async (req, res) => {
    try {
        const allOrders = await OrderModel.find({})

        res.json({
            success: true,
            allOrders
        });
    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
}



// Admin logout : /api/admin/admin-logout
export const adminLogout = async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    try {
        res.clearCookie("adminToken", {
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

        return res.json({
            success: false,
            message: error.message
        })
    }
}