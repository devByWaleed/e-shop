import { verifyAccessToken } from "../config/tokens.js";

const userAuth = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    }

    try {
        const tokenDecode = verifyAccessToken("user", token)

        if (tokenDecode.id && tokenDecode.role === "user") {
            req.userID = tokenDecode.id
            req.userRole = tokenDecode.role
            return next()
        }

        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    } catch (error) {
        return res.status(401).json({ success: false, message: "Session expired. Login Again" })
    }
}

export default userAuth;