import jwt from "jsonwebtoken"

const requiredRole = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.userRole || req.sellerRole

        if (!role) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            })
        }

        if (!allowedRoles.includes(role)) {
            return res.json({
                success: false,
                message: "Not Authorized for this action"
            })
        }

        next()
    }
}

export default requiredRole;