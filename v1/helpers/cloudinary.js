import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET 
  });

export const uploadImageToCloud = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "ad_uploads" }, 
            (error, result) => {
                if (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    reject(error);
                    return;
                }
                const { secure_url, public_id } = result;

                resolve({ secure_url, public_id });
            }
        ).end(imageBuffer);
    });
};

export const deleteImageFromCloud = (public_id) =>{
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) =>{
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };