import { verifyAccessToken } from "../config/tokens.js";

const sellerAuth = async (req, res, next) => {
    const sellerToken = req.cookies?.sellerToken;

    if (!sellerToken) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    }

    try {
        const tokenDecode = verifyAccessToken("seller", sellerToken)

        if (tokenDecode.id && tokenDecode.role === "seller") {
            req.sellerID = tokenDecode.id
            req.sellerRole = tokenDecode.role
            return next()
        }

        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    } catch (error) {
        return res.status(401).json({ success: false, message: "Session expired. Login Again" })
    }
}

export default sellerAuth;