import { verifyAccessToken } from "../config/tokens.js";

const COOKIES = [
    { cookie: "token", role: "user" },
    { cookie: "sellerToken", role: "seller" },
    { cookie: "adminToken", role: "admin" },
];

const anyAuth = (req, res, next) => {
    const actors = [];

    for (const { cookie, role } of COOKIES) {
        const token = req.cookies?.[cookie];
        if (!token) continue;

        try {
            const decoded = verifyAccessToken(role, token);
            if (decoded.id && decoded.role === role) {
                actors.push({ id: String(decoded.id), role });
            }
        } catch (error) {
            // Invalid or expired cookie: ignore it and try the next one
        }
    }

    if (actors.length === 0) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    req.actors = actors;
    next();
};

export default anyAuth;

// Helpers used by the chat controllers
export const actorIds = (req) => (req.actors || []).map((actor) => actor.id);
export const isActor = (req, id) => actorIds(req).includes(String(id));