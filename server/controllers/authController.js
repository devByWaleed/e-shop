import UserModel from "../models/Users.js";
import SellerModel from "../models/Sellers.js";
import {
    SESSION_COOKIES,
    cookieBase,
    REFRESH_MAX_AGE,
    accessMaxAge,
    signAccessToken,
    newRefreshToken,
    hashToken,
} from "../config/tokens.js";

const ACCOUNTS = [
    { role: "user", model: UserModel },
    { role: "seller", model: SellerModel },
];

// The old refresh token still works for 30 seconds,
// so two open tabs refreshing at the same moment do not log each other out
const GRACE_MS = 30 * 1000;

// Refresh the login : POST /api/auth/refresh
export const refreshSessions = async (req, res) => {
    try {
        let refreshedAny = false;

        for (const { role, model } of ACCOUNTS) {
            const { access, refresh } = SESSION_COOKIES[role];
            const oldToken = req.cookies?.[refresh];
            if (!oldToken) continue;

            const oldHash = hashToken(oldToken);
            const account = await model.findOne({ "refreshTokens.hash": oldHash }).select("+refreshTokens");
            const entry = account?.refreshTokens.find((token) => token.hash === oldHash);

            // Unknown or expired refresh token: remove the cookie, this role is logged out
            if (!account || !entry || entry.expiresAt < new Date()) {
                res.clearCookie(refresh, cookieBase);
                continue;
            }

            // Rotate: issue a new refresh token and let the old one expire in 30 seconds
            const newToken = newRefreshToken();
            const now = Date.now();

            account.refreshTokens = account.refreshTokens
                .filter((token) => token.expiresAt > new Date())
                .map((token) =>
                    token.hash === oldHash
                        ? { hash: token.hash, expiresAt: new Date(Math.min(token.expiresAt.getTime(), now + GRACE_MS)) }
                        : token
                )
                .concat({ hash: hashToken(newToken), expiresAt: new Date(now + REFRESH_MAX_AGE) });

            await account.save({ validateBeforeSave: false });

            res.cookie(access, signAccessToken(role, account._id), { ...cookieBase, maxAge: accessMaxAge(role) });
            res.cookie(refresh, newToken, { ...cookieBase, maxAge: REFRESH_MAX_AGE });
            refreshedAny = true;
        }

        if (!refreshedAny) {
            return res.status(401).json({ success: false, message: "Please log in again" });
        }

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Could not refresh the session" });
    }
};
