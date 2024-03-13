import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.memoryStorage(); //using memory storage to handle files in memory

const uploadMulter = multer({ storage });

const processImage = async (req, res, next) => {
  if (req.file) {
    try {
      const filename = `${Date.now()}-${req.file.originalname}`;
      const targetDir = path.join(__dirname, '..', 'public', 'uploads');
      const targetPath = path.join(targetDir, filename);

      await sharp(req.file.buffer) //processing the image with sharp directly from buffer and save to target path
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toFile(targetPath);

      // Update req.file to reflect the path of the processed image
      // so it can be used in subsequent middleware or route handlers
      req.file.path = targetPath;
      req.file.filename = filename; // Update filename to processed filename
    } catch (error) {
      return next(error); // Pass errors to Express
    }
  }
  next(); // Proceed to the next middleware
};

export { uploadMulter, processImage };
