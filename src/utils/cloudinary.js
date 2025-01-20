import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

//configuration
cloudinary.config({ 
    cloud_name: process.env.CLODINARY_CLOUD_NAME, 
    api_key: process.env.CLODINARY_API_KEY, 
    api_secret: process.env.CLODINARY_API_SECRET 
});

const uploadCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
            //upload file on cloudinary
         const response =  await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
        // file has been uploaded
        console.log("File uploaded on cloudinary",response.url);
        return response.url;
    } catch (error) {
        //remove the locally saved temp file 
        fs.unlinkSync(localFilePath)
        return null;
    }
}
 // Upload an image
//  const uploadResult = await cloudinary.uploader.upload(
//      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//          public_id: 'shoes',
//      })
//  .catch((error) => {
//      console.log(error);
//  });

// console.log(uploadResult);
export {uploadCloudinary};