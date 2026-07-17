import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
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


// Configuring server
const app = express();


// Allow multiple origins
const allowedOrigin = ["http://localhost:5173"];
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Set Security  Headers
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],   // React needs this in dev
//             imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
//             connectSrc: ["'self'", "https://api.stripe.com"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         }
//     },
//     crossOriginOpenerPolicy: { policy: "same-origin" },
//     strictTransportSecurity: { maxAge: 31536000 }
// }))


// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/order/stripe/webhook', express.raw({ type: 'application/json' }));

// Contains Stripe Webhook
app.use('/api/order', orderRouter);


await connectCloudinary();
await connectDB();


// API endpoints
app.get('/', (req, res) => res.send("API Is Working!!!"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/event', eventRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);
app.use('/api/admin', adminRouter);


// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on PORT ${process.env.PORT}`);
    });
}


// Exporting for vercel configuration
export default app;