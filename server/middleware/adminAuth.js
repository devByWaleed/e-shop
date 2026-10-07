import { verifyAccessToken } from "../config/tokens.js";

const adminAuth = async (req, res, next) => {
    const adminToken = req.cookies?.adminToken;

    if (!adminToken) {
        return res.status(401).json({ success: false, message: "Not authorized. Please login again." });
    }

    try {
        const tokenDecode = verifyAccessToken("admin", adminToken);

        if (tokenDecode.id && tokenDecode.role === "admin") {
            req.adminID = tokenDecode.id;
            req.adminRole = tokenDecode.role;
            return next();
        }

        return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please login again." });
        }
        return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
    }
};

export default adminAuth;