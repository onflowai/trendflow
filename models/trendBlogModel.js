import mongoose from 'mongoose';
/**
 * Example
 * title:
 * content:
 * author:
 * createdAt:
 * updatedAt:
 * Trends:
 */
const TrendBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    Trends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend', // reference to the Trend models which will be referenced in Blog
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TrendBlog', TrendBlogSchema);
