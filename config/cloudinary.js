import cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

const cloudinary2 = cloudinary.v2;
cloudinary2.config({
  cloud_name: process.env.CLOUD_NAME_TWO,
  api_key: process.env.CLOUD_API_KEY_TWO,
  api_secret: process.env.CLOUD_API_SECRET_TWO,
});

export { cloudinary2 };
