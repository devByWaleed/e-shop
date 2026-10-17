import jwt from "jsonwebtoken"
import { cookieBase } from "../config/tokens.js";
import { isAccountUsable } from "./accountStatus.js";

const userAuth = async (req, res, next) => {
    const token = req.cookies?.token;  // Safe navigation

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again"
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id && tokenDecode.role) {
            // The cookie lives for a year, so the account is checked on every request
            if (!(await isAccountUsable("user", tokenDecode.id))) {
                res.clearCookie("token", cookieBase)
                return res.json({
                    success: false,
                    code: "ACCOUNT_UNAVAILABLE",
                    message: "This account is not available. Please contact support."
                })
            }

            req.userID = tokenDecode.id
            req.userRole = tokenDecode.role
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

export default userAuth;