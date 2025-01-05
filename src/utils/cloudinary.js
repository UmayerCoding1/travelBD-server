import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name: 'dlh8axija',
    api_key: '734479388384749',
    api_secret: 'yDqsgyKi-rprpKUZnSesF-Z2_Xw'
});
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });




const uploadCloudinary = async(localPath) => {
    try {
      if(!localPath) return null;

      const response = await cloudinary.uploader.upload(localPath, {
        resource_type: 'auto',
      });
      fs.unlinkSync(localPath);
      return response;
    
  } catch (error) {
    console.log(error);

    fs.unlinkSync(localPath);
    return null;
  }
}

export {uploadCloudinary};