import jwt from "jsonwebtoken";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";

// One secret per role: a token made for a buyer can never pass as a seller or admin token
const SECRETS = {
    admin: process.env.ADMIN_JWT_SECRET,
};

// Stop at startup when a secret is missing (better than signing tokens with "undefined")
if (!SECRETS.admin) {
    throw new Error("Missing ADMIN_JWT_SECRET in the environment");
}

// How long the ACCESS cookie lives, in minutes.
// If you only do Part A (no refresh tokens yet), set user and seller to 10080 (7 days).
const ACCESS_MINUTES = { user: 15, seller: 15, admin: 480 };

export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;   // 7 days

export const accessMaxAge = (role) => ACCESS_MINUTES[role] * 60 * 1000;

export const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
};

export const signAccessToken = (role, id) =>
    jwt.sign({ id: String(id), role }, SECRETS[role], { expiresIn: `${ACCESS_MINUTES[role]}m` });

export const verifyAccessToken = (role, token) => jwt.verify(token, SECRETS[role]);


// ======================
// Part B: refresh tokens
// ======================
export const SESSION_COOKIES = {
    user: { access: "token", refresh: "userRefresh" },
    seller: { access: "sellerToken", refresh: "sellerRefresh" },
};

export const newRefreshToken = () => crypto.randomBytes(48).toString("hex");

// Only the hash is stored in the database, so a database leak does not leak working tokens
export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Gives the browser a short access cookie and a long refresh cookie
export const startSession = async (res, model, role, account) => {
    const { access, refresh } = SESSION_COOKIES[role];
    const refreshToken = newRefreshToken();

    await model.updateOne(
        { _id: account._id },
        {
            $push: {
                refreshTokens: {
                    $each: [{ hash: hashToken(refreshToken), expiresAt: new Date(Date.now() + REFRESH_MAX_AGE) }],
                    $slice: -5,   // keep only the 5 newest sessions (devices)
                },
            },
        }
    );

    res.cookie(access, signAccessToken(role, account._id), { ...cookieBase, maxAge: accessMaxAge(role) });
    res.cookie(refresh, refreshToken, { ...cookieBase, maxAge: REFRESH_MAX_AGE });
};

// Logs out: cancels this browser's refresh token and removes both cookies
export const endSession = async (req, res, model, role) => {
    const { access, refresh } = SESSION_COOKIES[role];
    const refreshToken = req.cookies?.[refresh];

    if (refreshToken) {
        const hash = hashToken(refreshToken);
        await model.updateOne({ "refreshTokens.hash": hash }, { $pull: { refreshTokens: { hash } } });
    }

    res.clearCookie(access, cookieBase);
    res.clearCookie(refresh, cookieBase);
};
