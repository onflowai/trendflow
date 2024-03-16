import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import trendModel from './models/trendModel.js';
import userModel from './models/userModel.js';
dotenv.config();
/**
 * File used to load trends in batches in this format
 */
try {
  await mongoose.connect(process.env.MONGODB_URL);
  const user = await userModel.findOne({ email: 'test@test.com' }); //give the email for user which you want all the trends to be loaded with
  const jsonTrends = JSON.parse(
    await readFile(new URL('./utils/data.json', import.meta.url))
  ); //add data.json file to utils folder
  const trends = jsonTrends.map((trend) => {
    return { ...trend, createdBy: user._id };
  });
  await trendModel.deleteMany({ createdBy: user._id });
  await trendModel.create(trends);
  console.log('Trends Loaded');
} catch (error) {
  console.log(error);
  process.exit(0);
}
