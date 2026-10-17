import crypto from "crypto";
import { getCloudinaryPublicId } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/Users.js";
import SellerModel from "../models/Sellers.js";
import ProductModel from "../models/Products.js";
import EventModel from "../models/Events.js";
import OrderModel from "../models/Orders.js";
import CouponModel from "../models/Coupons.js";
import jwt from "jsonwebtoken"
import { signAccessToken, verifyAccessToken, accessMaxAge, cookieBase } from "../config/tokens.js";


// A closed shop can be reopened for this many days. After that it can be removed permanently.
const SHOP_GRACE_DAYS = 30;

// Orders in these statuses are finished. Everything else is still open.
// (The old list forgot "Received" and "On the way", so those orders did not block a delete.)
const FINISHED_ORDER_STATUSES = ["Delivered", "Refund success", "Cancelled"];

// Query for open orders. Unpaid card orders are ignored: buyers never see them
// and they expire by themselves after 3 days.
const openOrdersFilter = (extra) => ({
    ...extra,
    status: { $nin: FINISHED_ORDER_STATUSES },
    $or: [
        { "paymentInfo.type": "COD" },
        { "paymentInfo.status": { $in: ["Paid", "Refunded"] } },
    ],
});

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

const cleanReason = (text) => (typeof text === "string" ? text.trim().slice(0, 200) : "");

// Scrubbed accounts get a unique dummy email, so the real email can register again
const scrubbedEmail = (id) => `deleted_${id}@deleted.invalid`;

// Nobody knows this password, so a scrubbed account can never log in
const randomPassword = () => crypto.randomBytes(32).toString("hex");

// Reviews stay (so product ratings do not change) but lose the person's name and avatar
const anonymizeReviewsOf = (userId) =>
    ProductModel.updateMany(
        { "reviews.user._id": String(userId) },
        { $set: { "reviews.$[r].user.name": "Deleted user", "reviews.$[r].user.avatar": "" } },
        { arrayFilters: [{ "r.user._id": String(userId) }] }
    );

// Removes the reviews completely and fixes the average rating of those products
const removeReviewsOf = async (userId) => {
    const id = String(userId);
    const products = await ProductModel.find({ "reviews.user._id": id }).select("_id");

    await ProductModel.updateMany(
        { "reviews.user._id": id },
        { $pull: { reviews: { "user._id": id } } }
    );

    for (const { _id } of products) {
        const [result] = await ProductModel.aggregate([
            { $match: { _id } },
            { $project: { average: { $avg: "$reviews.rating" } } },
        ]);
        await ProductModel.updateOne({ _id }, { $set: { ratings: result?.average || 0 } });
    }
};

// Hides (or shows again) every product and event of one shop
const setShopVisibility = async (shopId, hidden) => {
    const filter = { shopId: String(shopId) };

    await Promise.all([
        ProductModel.updateMany(filter, { $set: { isHidden: hidden } }),
        EventModel.updateMany(filter, { $set: { isHidden: hidden } }),
    ]);
};


// Admin login : /api/admin/admin-login
export const adminLogin = async (req, res) => {
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
// Delete Specific User : /api/admin/delete-user-by-id/:id
// Optional: ?removeReviews=true removes the reviews instead of making them anonymous
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const removeReviews = req.query.removeReviews === "true"

        const userDetail = await UserModel.findById(id)

        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (userDetail.status === "deleted") {
            return res.json({
                success: false,
                message: "This user is already deleted"
            })
        }

        // 1. Do not delete a buyer who still has unfinished orders
        const openOrders = await OrderModel.countDocuments(openOrdersFilter({ user: id }))

        if (openOrders > 0) {
            return res.json({
                success: false,
                message: `This user has ${openOrders} unfinished order(s). Finish or cancel them first.`
            })
        }

        // 2. Reviews: anonymous by default, removed only when the admin asks
        if (removeReviews) {
            await removeReviewsOf(id)
        } else {
            await anonymizeReviewsOf(id)
        }

        // 3. Scrub the personal data but KEEP the document and its _id,
        //    so orders and chats that point to it keep working
        const now = new Date()
        await UserModel.updateOne(
            { _id: id },
            {
                $set: {
                    status: "deleted",
                    statusReason: cleanReason(req.query.reason),
                    statusChangedAt: now,
                    deletedAt: now,
                    name: "Deleted user",
                    email: scrubbedEmail(id),
                    phoneNumber: "",
                    addresses: [],
                    avatar: "",
                    password: randomPassword(),
                },
                $unset: { resetPasswordToken: "", resetPasswordTime: "" },
            }
        )

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


// Suspend or reactivate a user : PATCH /api/admin/user-status/:id
// Body: { status: "active" | "suspended", reason }
export const setUserStatus = async (req, res) => {
    try {
        const { status, reason } = req.body

        if (!["active", "suspended"].includes(status)) {
            return res.json({
                success: false,
                message: "Status must be active or suspended"
            })
        }

        const user = await UserModel.findById(req.params.id).select("status")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.status === "deleted") {
            return res.json({
                success: false,
                message: "A deleted user cannot be changed"
            })
        }

        if ((user.status || "active") === status) {
            return res.json({
                success: false,
                message: `User is already ${status}`
            })
        }

        await UserModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    status,
                    statusReason: status === "suspended" ? cleanReason(reason) : "",
                    statusChangedAt: new Date(),
                },
            }
        )

        return res.json({
            success: true,
            message: status === "suspended" ? "User suspended" : "User reactivated",
            status
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
// This CLOSES the shop: hidden for SHOP_GRACE_DAYS, admin can still reopen it.
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

        if (sellerDetail.status === "deleted") {
            return res.json({
                success: false,
                message: "This shop is already removed permanently"
            })
        }

        if (sellerDetail.status === "closed") {
            return res.json({
                success: false,
                message: "This shop is already closed. Use the permanent removal after the grace period."
            })
        }

        // 1. Do not close a shop that still has unfinished orders
        const openOrders = await OrderModel.countDocuments(openOrdersFilter({ "cart.seller": id }))

        if (openOrders > 0) {
            return res.json({
                success: false,
                message: `This seller has ${openOrders} unfinished order(s). Finish or cancel them first.`
            })
        }

        // 2. Close the shop and hide everything it sells
        const now = new Date()
        const purgeAfter = new Date(now.getTime() + SHOP_GRACE_DAYS * 24 * 60 * 60 * 1000)

        await SellerModel.updateOne(
            { _id: id },
            {
                $set: {
                    status: "closed",
                    statusReason: cleanReason(req.query.reason),
                    statusChangedAt: now,
                    purgeAfter,
                },
            }
        )
        await setShopVisibility(id, true)

        return res.json({
            success: true,
            message: `Shop closed. It can be removed permanently after ${purgeAfter.toISOString().slice(0, 10)}.`,
            status: "closed",
            purgeAfter
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}


// Suspend, reactivate or reopen a shop : PATCH /api/admin/seller-status/:id
// Body: { status: "active" | "suspended", reason }
export const setSellerStatus = async (req, res) => {
    try {
        const { status, reason } = req.body

        if (!["active", "suspended"].includes(status)) {
            return res.json({
                success: false,
                message: "Status must be active or suspended"
            })
        }

        const seller = await SellerModel.findById(req.params.id).select("status")

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            })
        }

        if (seller.status === "deleted") {
            return res.json({
                success: false,
                message: "A shop that was removed permanently cannot be changed"
            })
        }

        const current = seller.status || "active"

        if (current === status) {
            return res.json({
                success: false,
                message: `Shop is already ${status}`
            })
        }

        await SellerModel.updateOne(
            { _id: seller._id },
            {
                $set: {
                    status,
                    statusReason: status === "suspended" ? cleanReason(reason) : "",
                    statusChangedAt: new Date(),
                },
                $unset: { purgeAfter: "" },
            }
        )
        await setShopVisibility(seller._id, status !== "active")

        let message = "Shop reactivated"
        if (status === "suspended") message = "Shop suspended"
        else if (current === "closed") message = "Shop reopened"

        return res.json({ success: true, message, status })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}


// Remove a closed shop permanently : DELETE /api/admin/purge-seller-by-id/:id
// Allowed only after the grace period. ?force=true skips the wait (useful for testing).
export const purgeSeller = async (req, res) => {
    try {
        const id = req.params.id

        const sellerDetail = await SellerModel.findById(id)

        if (!sellerDetail) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            })
        }

        if (sellerDetail.status === "deleted") {
            return res.json({
                success: false,
                message: "This shop is already removed permanently"
            })
        }

        if (sellerDetail.status !== "closed") {
            return res.json({
                success: false,
                message: "Close the shop first. It is removed permanently only after the grace period."
            })
        }

        const waitIsOver = sellerDetail.purgeAfter && sellerDetail.purgeAfter <= new Date()

        if (!waitIsOver && req.query.force !== "true") {
            const date = sellerDetail.purgeAfter ? sellerDetail.purgeAfter.toISOString().slice(0, 10) : "later"
            return res.json({
                success: false,
                message: `The grace period ends on ${date}.`
            })
        }

        // 1. Check once more that nothing is still open
        const openOrders = await OrderModel.countDocuments(openOrdersFilter({ "cart.seller": id }))

        if (openOrders > 0) {
            return res.json({
                success: false,
                message: `This seller has ${openOrders} unfinished order(s). Finish or cancel them first.`
            })
        }

        // 2. Remember every image that must be removed from Cloudinary
        const [products, events] = await Promise.all([
            ProductModel.find({ shopId: String(id) }).select("images"),
            EventModel.find({ shopId: String(id) }).select("images"),
        ])

        const imageUrls = [
            sellerDetail.avatar,
            ...products.flatMap((product) => product.images || []),
            ...events.flatMap((event) => event.images || []),
        ].filter(Boolean)

        // 3. Remove the shop's catalog (finished orders and chats are kept as history)
        await Promise.all([
            ProductModel.deleteMany({ shopId: String(id) }),
            EventModel.deleteMany({ shopId: String(id) }),
            CouponModel.deleteMany({ shopId: String(id) }),
        ])

        // 4. Scrub the personal data but keep the document and its _id
        const now = new Date()
        await SellerModel.updateOne(
            { _id: id },
            {
                $set: {
                    status: "deleted",
                    statusChangedAt: now,
                    deletedAt: now,
                    name: "Deleted shop",
                    email: scrubbedEmail(id),
                    phoneNumber: 0,
                    address: "",
                    zipCode: 0,
                    avatar: "",
                    description: "",
                    password: randomPassword(),
                },
                $unset: { purgeAfter: "", resetPasswordToken: "", resetPasswordTime: "" },
            }
        )

        // 5. Images last: if Cloudinary fails, the removal itself still worked
        await deleteCloudinaryImages(imageUrls)

        return res.json({
            success: true,
            message: "Shop removed permanently",
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
        res.clearCookie("adminToken", cookieBase);

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
};