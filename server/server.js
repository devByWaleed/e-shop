import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js"
import productRouter from "./routes/productRoutes.js"
import eventRouter from "./routes/eventRoutes.js"
import { connectCloudinary } from "./config/cloudinary.js"
import couponRouter from "./routes/couponRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import conversationRouter from "./routes/conversationRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import jwt from "jsonwebtoken";
import anyAuth from "./middleware/anyAuth.js";
import authRouter from "./routes/authRoutes.js";


// Configuring server
const app = express();
const EXP_PORT = process.env.PORT


// Allow multiple origins
const allowedOrigin = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigin.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


// Vercel sits behind a proxy; this lets the rate limiter see the real visitor IP
app.set("trust proxy", 1);

// Security headers
app.use(helmet());


// ======================
// Rate limits (placed BEFORE body parsing, so floods are rejected early)
// ======================
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,                        // 300 requests per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.originalUrl.startsWith("/api/order/stripe/webhook"),   // never block Stripe
    message: { success: false, message: "Too many requests, please try again later" }
});

// A NEW limiter per route, so each sensitive route has its own counter
// (login attempts do not use up the register or OTP attempts)
const makeAuthLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,                         // only 10 tries per 15 minutes per route
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts, please try again later" }
});

app.use("/api", generalLimiter);

[
    "/api/user/login",
    "/api/user/register",
    "/api/user/send-reset-otp",
    "/api/user/verify-reset-otp",
    "/api/user/reset-password",
    "/api/seller/seller-login",
    "/api/seller/seller-register",
    "/api/seller/seller-send-reset-otp",
    "/api/seller/seller-verify-reset-otp",
    "/api/seller/seller-reset-password",
    "/api/admin/admin-login",
].forEach((path) => app.use(path, makeAuthLimiter()));


// Stripe webhook (raw body) stays ABOVE express.json()
app.use('/api/order/stripe/webhook', express.raw({ type: 'application/json' }));

// Middleware configuration
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


let dbConnected = false;
let cloudinaryConnected = false;

async function initializeServices() {
    try {
        // Connect to MongoDB
        if (!dbConnected) {
            await connectDB();
            dbConnected = true;
            console.log("✅ MongoDB connected");
        }
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        // Don't throw - let the function handle it
    }

    try {
        // Connect to Cloudinary
        if (!cloudinaryConnected) {
            await connectCloudinary();
            cloudinaryConnected = true;
            console.log("✅ Cloudinary connected");
        }
    } catch (error) {
        console.error("❌ Cloudinary connection failed:", error.message);
    }
}

// Initialize connections BEFORE routes
await initializeServices();


// API endpoints
app.get('/', (req, res) => res.send("API Is Working!!!"));

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        dbConnected,
        cloudinaryConnected,
        timestamp: new Date().toISOString(),
    });
});

// Routers
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/event', eventRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/order', orderRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Short-lived token the frontend uses to connect to the socket server
app.get("/api/auth/socket-token", anyAuth, (req, res) => {
    const token = jwt.sign(
        { ids: req.actors.map((actor) => actor.id) },   // every identity this browser is logged in as
        process.env.SOCKET_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ success: true, token });
});


// ======================
// Global error handler (must come AFTER the routers and have 4 parameters)
// ======================
app.use((err, req, res, next) => {
    // Upload errors from Multer
    if (err.name === "MulterError") {
        const messages = {
            LIMIT_FILE_SIZE: "File is too large (max 5 MB)",
            LIMIT_FILE_COUNT: "Too many files uploaded",
            LIMIT_UNEXPECTED_FILE: "Too many files or wrong upload field",
        };
        return res.status(400).json({
            success: false,
            message: messages[err.code] || "Upload error"
        });
    }

    // Broken or oversized request bodies
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
    }
    if (err.type === "entity.too.large") {
        return res.status(413).json({ success: false, message: "Request body is too large" });
    }

    // Everything else: log it, but do not leak internals to the visitor
    console.error(err);

    const status = err.status || 500;
    const message = status < 500
        ? err.message
        : (process.env.NODE_ENV === "production" ? "Something went wrong" : err.message);

    return res.status(status).json({ success: false, message });
});


// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(EXP_PORT, () => {
        console.log(`Server running on PORT ${EXP_PORT}`);
    });
}


// Exporting for vercel configuration
export default app;