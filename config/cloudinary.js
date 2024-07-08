import cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';
//setting up access to .env
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinary2 = cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME_2,
  api_key: process.env.CLOUD_API_KEY_2,
  api_secret: process.env.CLOUD_API_SECRET_2,
});

export { cloudinary, cloudinary2 };
