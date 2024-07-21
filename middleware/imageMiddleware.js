import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sanitizeHTML } from '../utils/sanitization.js';
/**
 * uploadMulter middleware uses multer to handle file uploads. It stores the files in memory for further processing
 * processSVG process SVG files by sanitizing their content and saving them to the disk
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.memoryStorage(); //using memory storage to handle files in memory
const uploadMulter = multer({ storage });

const ensureDirectoryExistence = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error ensuring directory existence: ${error.message}`);
    throw error;
  }
};

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

const processSVG = async (req, res, next) => {
  if (req.file) {
    try {
      const filename = `${Date.now()}-${req.file.originalname}`;
      const targetDir = path.join(__dirname, '..', 'public', 'uploads');
      const targetPath = path.join(targetDir, filename);
      await ensureDirectoryExistence(targetDir);
      const sanitizedSVG = sanitizeHTML(req.file.buffer.toString()); // Sanitize the SVG content
      await fs.writeFile(targetPath, sanitizedSVG); // Save the file to the target path

      // Update req.file to reflect the path of the processed SVG
      req.file.path = targetPath;
      req.file.filename = filename;
    } catch (error) {
      return next(error); // Pass errors to Express
    }
  }
  next(); // Proceed to the next middleware
};

export { uploadMulter, processImage, processSVG };
