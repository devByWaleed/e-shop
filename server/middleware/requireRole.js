import jwt from "jsonwebtoken"

const requiredRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            })
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.json({
                success: false,
                message: "Not Authorized for this action"
            })
        }

        next()
    }
}

export default requiredRole;