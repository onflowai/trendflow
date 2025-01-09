import trendModel from '../models/trendModel.js';
import trendBlogModel from '../models/trendBlogModel.js';
// import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
/**
 * CREATE BLOG
 * Create a new blog post (admin only)
 * @param {*} req
 * @param {*} res
 */
export const createPost = async (req, res) => {
  try {
    let { title, content, trends } = req.body;
    title = sanitizeHTML(title);
    content = sanitizeHTML(content);
    const author = req.user.userID; // populating author with userID from the authenticated user
    const validTrends = await trendModel.find({ _id: { $in: trends } });
    if (validTrends.length !== trends.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'One or more trends are invalid.',
      }); // validating trends
    }
    const newPost = new trendBlogModel({ title, content, author, trends });
    await newPost.save();
    res.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * GET ALL POSTS
 * returns all posts which are in the schema currently sorted newest to oldest with page limit
 * @param {*} req
 * @param {*} res
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await trendBlogModel.find().populate('author').populate({
      path: 'trends',
      select: 'trend slug trendTech techIconUrl svg_url trendCategory',
    }); // retrieving all blog posts, populated with the author and trends fields with selected fields
    res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * GET SINGLE POST
 * Get a single blog post by slug
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getSinglePost = async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await trendBlogModel
      .findOne({ slug })
      .populate('author')
      .populate({
        path: 'trends',
        select: 'trend slug trendTech techIconUrl svg_url trendCategory',
      });
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * UPDATE POST
 * Update a blog post by slug (admin only)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updatePost = async (req, res) => {
  const { slug } = req.params;
  const { content, trends } = req.body;

  try {
    if (trends) {
      const validTrends = await trendModel.find({ _id: { $in: trends } });
      if (validTrends.length !== trends.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'One or more trends are invalid',
        });
      }
    } //validating the trends
    const updateFields = {};
    if (content) updateFields.content = content;
    if (trends) updateFields.trends = trends;

    const updatedPost = await trendBlogModel
      .findOneAndUpdate({ slug }, updateFields, { new: true })
      .populate(
        'author trends',
        'trend slug trendTech techIcon svg_url trendCategory'
      );

    if (!updateFields) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' }); //if post not in the model return not found
    }

    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
/**
 * DELETE POST
 * Delete a blog post by slug (admin only)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deletePost = async (req, res) => {
  const { slug } = req.params;
  try {
    const deletedPost = await trendBlogModel.findOneAndDelete({ slug });
    if (!deletedPost) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: 'Post deleted', post: deletedPost });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
