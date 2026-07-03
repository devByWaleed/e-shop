import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}


export const getCloudinaryPublicId = (imageUrl) => {
    try {
        // Decode the URL to convert '%20' back to normal spaces ' '
        const decodedUrl = decodeURIComponent(imageUrl);

        const urlParts = decodedUrl.split('/');
        const filenameWithExtension = urlParts.pop(); // e.g., "img_name.jpg"
        const filename = filenameWithExtension.split('.')[0]; // e.g., "img_name"

        // Locate the version segment (matches 'v' followed by digits, like v1712345678)
        const versionIndex = urlParts.findIndex(part => /^v\d+$/.test(part));

        if (versionIndex !== -1 && urlParts.length > versionIndex + 1) {
            // Slices and reconstructs folder paths (e.g., ["Zenvio Media", "products"])
            const folders = urlParts.slice(versionIndex + 1).join('/');
            return folders ? `${folders}/${filename}` : filename;
        }

        // Fallback layout check
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