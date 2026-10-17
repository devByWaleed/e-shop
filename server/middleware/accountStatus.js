import mongoose from "mongoose";
import UserModel from "../models/Users.js";
import SellerModel from "../models/Sellers.js";

// Old accounts have no status field, so only these values block an account
export const BLOCKED_STATUSES = ["suspended", "closed", "deleted"];

// Used by the login middleware: true when the account exists and is allowed in
export const isAccountUsable = async (role, id) => {
    if (!mongoose.isValidObjectId(id)) return false;

    const Model = role === "seller" ? SellerModel : UserModel;
    const account = await Model.findById(id).select("status").lean();

    return Boolean(account) && !BLOCKED_STATUSES.includes(account.status);
};

// Used by chat: true when this id belongs to a blocked user or seller.
// Admin ids are not in these collections, so an admin is never blocked.
export const isAccountBlocked = async (id) => {
    if (!mongoose.isValidObjectId(id)) return false;

    const [user, seller] = await Promise.all([
        UserModel.exists({ _id: id, status: { $in: BLOCKED_STATUSES } }),
        SellerModel.exists({ _id: id, status: { $in: BLOCKED_STATUSES } }),
    ]);

    return Boolean(user || seller);
};