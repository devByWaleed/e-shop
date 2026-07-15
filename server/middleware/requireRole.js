import jwt from "jsonwebtoken";

const requiredRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Get role from the request (set by adminAuth, sellerAuth, or userAuth)
        const role = req.adminRole || req.sellerRole || req.userRole;

        if (!role) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again"
            });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied.`
            });
        }

        next();
    };
};

export default requiredRole;