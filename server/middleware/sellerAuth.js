import jwt from "jsonwebtoken"
import { cookieBase } from "../config/tokens.js";
import { isAccountUsable } from "./accountStatus.js";

const sellerAuth = async (req, res, next) => {
    const sellerToken = req.cookies?.sellerToken;  // Use the seller cookie name set by seller login

    if (!sellerToken) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again"
        })
    }

    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)

        if (tokenDecode.id && tokenDecode.role) {
            // The cookie lives for a year, so the account is checked on every request
            if (!(await isAccountUsable("seller", tokenDecode.id))) {
                res.clearCookie("sellerToken", cookieBase)
                return res.json({
                    success: false,
                    code: "ACCOUNT_UNAVAILABLE",
                    message: "This account is not available. Please contact support."
                })
            }

            req.sellerID = tokenDecode.id
            req.sellerRole = tokenDecode.role
            next()
        } else {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            })
        }
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export default sellerAuth;