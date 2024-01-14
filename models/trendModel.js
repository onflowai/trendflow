import mongoose from 'mongoose';
import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
//building the database schema
const TrendSchema = new mongoose.Schema(
  {
    trend: String,
    trendCategory: {
      type: String,
      enum: Object.values(TREND_CATEGORY),
      default: TREND_CATEGORY.PROGRAMMING_LANGUAGES,
    },
    trendTech: {
      type: String,
      enum: Object.values(TECHNOLOGIES),
      default: TECHNOLOGIES.JAVASCRIPT,
    },
    trendDesc: {
      type: String,
      default: 'description',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
//Name of the table is Trend
export default mongoose.model('Trend', TrendSchema);
