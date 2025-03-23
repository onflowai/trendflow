import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugUtils.js';
/**
 * Collection Name: trendblogs
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
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    trends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend', // reference to the Trend models which will be referenced in Blog
      },
    ],
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
TrendBlogSchema.pre('validate', async function (next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);
    const exists = await mongoose.models.TrendBlog.findOne({
      slug: this.slug,
    }).exec();
    if (exists) {
      throw new Error(
        'Blog with this Title already exists. Duplicate Blogs are not allowed.'
      );
    }
  }
  next();
});

export default mongoose.model('TrendBlog', TrendBlogSchema);
