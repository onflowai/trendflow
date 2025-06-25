import mongoose from 'mongoose';
// import {
//   TREND_CATEGORY,
//   TECHNOLOGIES,
//   trendCategoryValues,
//   technologiesValues,
// } from '../utils/constants.js';
import { generateSlug } from '../utils/slugUtils.js';
import {
  trendCategoryValues,
  technologiesValues,
} from '../utils/dynamicEnums.js';
//building the database schema
/**
 *
 * Example:
 * _id: ObjectId('id_of_the_trend')
 * trend:
 * trendCategory:
 * trendTech:
 * trendDesc:
 * trendStatus: trending, breakout, cool-off, static, sublevel, undefined
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
      enum: trendCategoryValues,
      default: 'API Development Tools',
    },
    trendTech: {
      type: String,
      enum: technologiesValues,
      default: 'Ada',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    svg_url: String,
    svg_public_id: String,
    techIconUrl: {
      type: String,
      required: true,
    },
    cateIconUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    openSourceStatus: {
      type: String,
      enum: ['open', 'partial', 'closed', 'unknown'],
      default: 'unknown',
    },
    //AFTER APPROVAL DATA:
    isApproved: {
      type: Boolean,
      default: false,
    },
    trendStatsFetched: Boolean,
    interestOverTime: {
      previousYear: {
        type: [
          {
            date: String,
            count: Number,
          },
        ],
        _id: false, // Prevents MongoDB from creating a default _id field
        default: [], // Ensures that the array is initialized even if not provided
      },
      currentYear: {
        type: [
          {
            date: String,
            count: Number,
          },
        ],
        _id: false, // No _id for sub-documents in this array either
        required: true, // Ensures this array must be provided
      },
    },
    flashChart: {
      count: Number,
    },
    trendStatus: {
      type: String,
      default: 'undefined',
    },
    trendDesc: {
      type: String,
      default: 'description',
    },
    generatedBlogPost: {
      type: String,
      default: '',
    },
    trendUse: {
      type: String,
      default: '',
    },
    contentGenerated: Boolean,
    forecast: {
      previousYear: {
        type: [
          {
            date: String,
            count: Number,
          },
        ],
        _id: false, // Prevents MongoDB from creating a default _id field
        default: [], // Ensures that the key exists even if empty
      },
      currentYear: {
        type: [
          {
            date: String,
            count: Number,
          },
        ],
        _id: false, // Similar purpose as above
        required: true, // Ensures this field must be provided
      },
    },
    t_score: {
      type: Number,
      default: 0,
    },
    f_score: {
      type: Number,
      default: 0,
    },
    combinedScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// indexes for optimized querying
TrendSchema.index({ trendCategory: 1, trendTech: 1 }); // filtering by category and tech
TrendSchema.index({ slug: 1 }); // quick lookups by slug
TrendSchema.index({ isApproved: 1, _id: 1 }); //index specifically for cursor pagination
TrendSchema.index({ isApproved: 1, updatedAt: -1 }); // optimizes approved trends sorted by update time
TrendSchema.index({ views: -1 }); // sorting by views (top viewed)
TrendSchema.index({ trendStatus: 1 }); // status-based filters
TrendSchema.index({ createdAt: -1 }); // sorting by creation date

/**
 * doc-based middleware runs on doc.save() or doc.validate()
 * but NOT on findOneAndUpdate
 */
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
