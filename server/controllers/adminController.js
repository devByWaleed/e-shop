import jwt from "jsonwebtoken";
import { getCloudinaryPublicId } from "../config/cloudinary.js";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/Users.js";
import SellerModel from "../models/Sellers.js";
import ProductModel from "../models/Products.js";
import EventModel from "../models/Events.js";
import OrderModel from "../models/Orders.js";


// Admin login : /api/admin/admin-login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check credentials against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            // Create admin user object with role
            const adminUser = {
                id: "admin_" + Date.now(), // Generate a unique ID for admin
                email: process.env.ADMIN_EMAIL,
                role: "admin" // Set role as "admin"
            };

            // Generate JWT token with admin ID and role
            const adminToken = jwt.sign(
                {
                    id: adminUser.id,
                    role: adminUser.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Set cookie with the token
            res.cookie("adminToken", adminToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true in production
                sameSite: "lax",
                maxAge: 7 * 24 * 3600 * 1000, // 7 days
                path: "/"
            });

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

        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);

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

        if (userDetail.avatar) {
            try {
                const publicId = getCloudinaryPublicId(userDetail.avatar)
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            } catch (cloudinaryError) {
                console.error("Failed to delete avatar from Cloudinary:", cloudinaryError.message)
            }
        }

        await UserModel.findByIdAndDelete(id)

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

        if (sellerDetail.avatar) {
            try {
                const publicId = getCloudinaryPublicId(sellerDetail.avatar)
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            } catch (cloudinaryError) {
                console.error("Failed to delete avatar from Cloudinary:", cloudinaryError.message)
            }
        }

        await SellerModel.findByIdAndDelete(id)

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

    try {
        res.clearCookie("adminToken", {
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