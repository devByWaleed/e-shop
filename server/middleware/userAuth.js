import jwt from "jsonwebtoken"

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