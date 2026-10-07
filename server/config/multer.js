import multer from "multer";

// Keep uploads in memory (they are streamed straight to Cloudinary, nothing is written to disk)
const storage = multer.memoryStorage();

// Only these image types are accepted (add "image/heic" here if your users upload iPhone photos)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error("Only JPG, PNG, WEBP or GIF images are allowed");
        error.status = 400;   // the global error handler in server.js shows this message to the user
        cb(error, false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,   // 5 MB per file
        files: 10,                   // at most 10 files per request
        fields: 50,                  // at most 50 text fields per request
    },
    fileFilter: fileFilter
});