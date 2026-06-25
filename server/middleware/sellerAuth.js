import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const sellerToken = req.cookies?.sellerToken;  // Safe navigation

    if (!sellerToken) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again"
        })
    }

    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)

        if (tokenDecode.id && tokenDecode.role) {
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

export default userAuth;