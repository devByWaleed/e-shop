import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import "dotenv/config"
import userRouter from "./routes/userRoutes.js";
import { fileURLToPath } from "url"
import path from "path"


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
app.use(cookieParser());


// static files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/", express.static(path.join(__dirname, "uploads")));


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter);


await connectDB();
// await connectCloudinary();


// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500
//     const message = err.message || "Internal Server Error"
//     return res.status(statusCode).json({
//         success: false,
//         statusCode,
//         message
//     })
// })


// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on PORT ${process.env.PORT}`);
    });
}


// Exporting for vercel configuration
export default app;