import trendModel from '../models/trendModel.js';
import trendBlogModel from '../models/trendBlogModel.js';
// import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
//import { dedupeTrendsKeepAll } from '../utils/duplicateRemover.js';
/**
 * CREATE BLOG
 * Create a new blog post (admin only)
 * @param {*} req
 * @param {*} res
 */
export const createPost = async (req, res) => {
  try {
    let { title, content, trends, isPublic } = req.body;
    title = sanitizeHTML(title);
    content = sanitizeHTML(content);

    const author = req.user.userID; // populating author with userID from the authenticated user
    const validTrends = await trendModel.find({ _id: { $in: trends } });
    if (validTrends.length !== trends.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'One or more trends are invalid.',
      }); // validating trends
    }
    const newPost = new trendBlogModel({
      title,
      content,
      author,
      trends,
      isPublic: isPublic,
    });
    await newPost.save();
    res.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}; //end createPost

/**
 * GET ALL POSTS
 * returns all posts which are in the schema currently sorted newest to oldest with page limit
 * @param {*} req
 * @param {*} res
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await trendBlogModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username githubUsername profile_img privacy role', //only return safe fields
      })
      .populate({
        path: 'trends',
        select: 'trend slug trendTech techIconUrl svg_url trendCategory',
      });
    const processedPosts = posts.map((post) => {
      //const uniqueTrends = dedupeTrendsKeepAll(post.trends); //removing duplicates
      return {
        ...post.toObject(), // converting mongoose document to plain object
        trends: post.trends,
      };
    }); // remove duplicate trends based on techIconUrl

    res.status(StatusCodes.OK).json(processedPosts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}; //end getAllPosts
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
    //const uniqueTrends = dedupeTrendsKeepAll(post.trends); //removing duplicates
    const processedPost = {
      ...post.toObject(), // converting mongoose document to plain object
      trends: post.trends,
    };
    res.status(StatusCodes.OK).json(processedPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}; //end getSinglePost

/**
 * GET PUBLIC SINGLE POST
 * Get a single blog post by slug
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getSinglePublicBlog = async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await trendBlogModel
      .findOne({ slug, isPublic: true })
      .populate({
        path: 'author',
        select: 'username githubUsername profile_img privacy role',
      })
      .populate({
        path: 'trends',
        select: 'trend slug trendTech techIconUrl svg_url trendCategory',
      });
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Post not found or not public' });
    }
    //const uniqueTrends = dedupeTrendsKeepAll(post.trends);
    const processedPost = {
      ...post.toObject(),
      trends: post.trends,
    };
    res.status(StatusCodes.OK).json(processedPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}; //end getSinglePublicBlog

/**
 * UPDATE POST
 * Update a blog post by slug (admin only)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updatePost = async (req, res) => {
  const { slug } = req.params;
  const { content, trends, isPublic } = req.body;

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
    if (typeof isPublic === 'boolean') {
      updateFields.isPublic = isPublic;
    }
    if (content) {
      content = sanitizeHTML(content);
      updateFields.content = content;
    }
    if (trends) {
      updateFields.trends = trends;
    }

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
}; //end updatePost
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
}; //end deletePost

/**
 * GET PUBLIC POST
 * fetching posts tagged as public
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getPublicPosts = async (req, res) => {
  try {
    const publicPosts = await trendBlogModel
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username githubUsername profile_img privacy role', //only return safe fields
      })
      .populate({
        path: 'trends',
        select: 'trend slug trendTech techIconUrl svg_url trendCategory',
      }); // only fetching posts where isPublic = true

    const processedPosts = publicPosts.map((post) => {
      //const uniqueTrends = dedupeTrendsKeepAll(post.trends);
      return { ...post.toObject(), trends: post.trends };
    });

    res.status(StatusCodes.OK).json(processedPosts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
