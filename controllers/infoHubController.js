import infoHubModel from '../models/infoHubModel.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import cloudinary2 from 'cloudinary';

/**
 * CREATE HUB CARD
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createInfoHub = async (req, res) => {
  const { title, description, link } = req.body;

  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'No file uploaded' });
  }

  try {
    // Upload the SVG to Cloudinary
    const response = await cloudinary2.v2.uploader.upload(req.file.path, {
      folder: 'infohub_svgs',
    });

    // Remove the local file after upload
    await fs.unlink(req.file.path);

    // Create a new InfoHub item with the URL of the uploaded SVG
    const infoHubItem = new infoHubModel({
      title,
      description,
      link,
      svg_img: response.secure_url, // Store the URL of the SVG
    });

    await infoHubItem.save(); // Create new InfoHub entry

    res.status(StatusCodes.CREATED).json(infoHubItem);
  } catch (error) {
    console.error('Error creating info hub item:', error.stack); // Log full error stack
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * GET ALL HUB CARDS
 * @param {*} req
 * @param {*} res
 */
export const getAllInfoHub = async (req, res) => {
  try {
    const infoHubItems = await infoHubModel.find();
    res.status(StatusCodes.OK).json(infoHubItems);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * DELETE HUB CARD
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteInfoHub = async (req, res) => {
  const { id } = req.params;
  try {
    const infoHubItem = await infoHubModel.findByIdAndDelete(id);
    if (!infoHubItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Info card not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Info card deleted' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
