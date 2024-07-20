import infoHubModel from '../models/infoHubModel.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
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
  } // checking if file is uploaded
  try {
    const svgData = await fs.readFile(req.file.path, 'utf8'); // reading the uploaded SVG file
    const infoHubItem = new infoHubModel({
      title,
      description,
      link,
      svg_data: svgData,
    });
    await infoHubItem.save(); // creating new InfoHub entry
    await fs.unlink(req.file.path); // remove file after upload
    res.status(StatusCodes.CREATED).json(infoHubItem);
  } catch (error) {
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
