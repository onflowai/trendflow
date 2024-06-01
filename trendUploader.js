import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import trendModel from './models/trendModel.js';
import userModel from './models/userModel.js';
dotenv.config();
/**
 * File used to load trends in batches from /utils/data.json
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

//LOADING F T SCORES FOR TESTING
// Function to generate random t_score and f_score
const generateScores = () => {
  const t_score = Math.random() * 0.99 + 0.01; // t_score between 0.01 and 1
  const f_score = Math.random() * (1 - 0.09) + 0.09; // f_score between 0.09 and 1
  return { t_score, f_score };
};

try {
  await mongoose.connect(process.env.MONGODB_URL);
  const user = await userModel.findOne({ email: 'test@test.com' }); // give the email for user which you want all the trends to be loaded with
  const jsonTrends = JSON.parse(
    await readFile(new URL('./utils/data.json', import.meta.url))
  ); // add data.json file to utils folder

  const trends = jsonTrends.map((trend) => {
    const { t_score, f_score } = generateScores();
    return { ...trend, createdBy: user._id, t_score, f_score };
  });

  await trendModel.deleteMany({ createdBy: user._id });
  await trendModel.create(trends);
  console.log('Trends Loaded');
} catch (error) {
  console.log(error);
  process.exit(0);
}
