import mongoose from 'mongoose';
import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
import { generateSlug } from '../utils/slugUtils.js';
//building the database schema
/**
 *
 * Example:
 * _id: ObjectId('id_of_the_trend')
 * trend:
 * trendCategory:
 * trendTech:
 * trendDesc:
 * createdBy: ObjectId('id_of_the_user')
 * isApproved:
 * slug:
 * views:
 * createdAt: 2024-03-16T02:22:50.315+00:00
 * updatedAt: 2024-03-16T02:22:50.315+00:00
 * __v: 0
 */
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
    isApproved: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
TrendSchema.pre('validate', async function (next) {
  //Only generate a slug if the trend is new or the trend name has changed
  //This is important to avoid unnecessary slug generation on every save operation
  if (this.isNew || this.isModified('trend')) {
    this.slug = generateSlug(this.trend); //calling the utils function to modify trend for slug format
    const exists = await mongoose.models.Trend.findOne({
      slug: this.slug,
    }).exec(); //check if slug already exists
    // Loop to check if the slug exists and append a counter until a unique slug is found
    if (exists) {
      // Throw an error to be caught by your error handling middleware.
      // This stops the trend creation process and sends a meaningful error response to the user.
      throw new Error(
        'Trend already exists. Duplicate trends are not allowed.'
      );
    }
  }
  next();
});
//Name of the table is Trend
export default mongoose.model('Trend', TrendSchema);

// const TrendModel = mongoose.model('Trend', TrendSchema);
// export default TrendModel;
