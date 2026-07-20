import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// Uploads an in-memory buffer to Cloudinary — replaces the old path-based upload
export const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        Readable.from(buffer).pipe(uploadStream);
    });
};

export const getCloudinaryPublicId = (imageUrl) => {
    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const urlParts = decodedUrl.split('/');
        const filenameWithExtension = urlParts.pop();
        const filename = filenameWithExtension.split('.')[0];

        const versionIndex = urlParts.findIndex(part => /^v\d+$/.test(part));

        if (versionIndex !== -1 && urlParts.length > versionIndex + 1) {
            const folders = urlParts.slice(versionIndex + 1).join('/');
            return folders ? `${folders}/${filename}` : filename;
        }

        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
            const folders = urlParts.slice(uploadIndex + 2).join('/');
            return folders ? `${folders}/${filename}` : filename;
        }

        return filename;
    } catch (err) {
        console.error("Error parsing Cloudinary URL:", err.message);
        return null;
    }
};