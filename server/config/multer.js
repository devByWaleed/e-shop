import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials globally
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup pure memory storage. 
// This keeps files inside RAM as temporary buffers (req.files[i].buffer)
const storage = multer.memoryStorage();

// Export the upload middleware
export const upload = multer({ storage: storage });