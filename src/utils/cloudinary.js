import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.CLOUDINARY_CLOUD_NAME, "-0-0-0-0-0")
// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded to Cloudinary:", response.url);

        // Remove temp file after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;
    } catch (error) {
        console.error(" Cloudinary upload error:", error);

        // Remove temp file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadCloudinary };
