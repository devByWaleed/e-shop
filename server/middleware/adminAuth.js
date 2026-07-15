import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    // Check for adminToken cookie (not just "token")
    const adminToken = req.cookies?.adminToken;

    if (!adminToken) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Please login again."
        });
    }

    try {
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);

        // Check if token has required fields and role is admin
        if (tokenDecode.id && tokenDecode.role === "admin") {
            req.adminID = tokenDecode.id;
            req.adminRole = tokenDecode.role;
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
    } catch (error) {
        console.error("Token verification error:", error.message);

        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again."
        });
    }
};

export default adminAuth;