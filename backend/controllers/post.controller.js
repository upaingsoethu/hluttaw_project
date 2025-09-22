import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";
import paginate from "../helpers/pagination.js";
import { postValidation } from "../helpers/validation.js";

import moment from "moment/moment.js";
import { mongoIdValidaton } from "../helpers/validation.js";

moment.locale("my");

// List Posts with Pagination
export const postsList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const posts = await paginate(
      Post,
      page,
      limit,
      {},
      [
        { path: "author" },
        { path: "hluttawId" },
        { path: "tags" },
        { path: "committeeId" },
      ],
      { createdAt: -1 }
    );

    if (posts.items.length === 0) {
      const error = new Error("No posts found!");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      status: true,
      message: "Posts fetched successfully!",
      totalItems: posts.totalItems,
      data: posts.items.map((post) => ({
        id: post._id,
        hluttawTime: post.hluttawId.time,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.name),
        committee: post.committeeId?.name || null,
        viewCount: post.viewCount,
        viewRating: post.viewRating,
        createdAt: moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        updatedAt: moment(post.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
      })),
      pagination: {
        totalItems: posts.totalItems,
        totalPages: posts.totalPages,
        currentPage: posts.currentPage,
        hasNextPage: posts.hasNextPage,
        hasPrevPage: posts.hasPrevPage,
        nextPage: posts.nextPage,
        prevPage: posts.prevPage,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching posts!";
    throw error;
  }
};

export const createPost = async (req, res) => {
  try {
    const files = req.files; //files from multer middleware

    let { title, content, tags, hluttawId, committeeId } = req.body;
    //tags data check for array or string. String to array by split
    tags = tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [];
    //check post validation
    await postValidation(title, content, tags, hluttawId);
    //handle file upload for post images

    if (!files || files.length === 0) {
      const error = new Error("Please upload at least one image for the post!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    // create images path for database
    const imageUrl = files.map((file) => `/uploads/News/${file.filename}`);

    //create new post
    const newPost = new Post({
      title,
      content,
      imageUrl,
      tags,
      hluttawId,
      committeeId,
      author: req.user._id,
    });

    const post = await newPost.save();

    await post.populate([
      { path: "author" },
      { path: "committeeId" },
      { path: "tags" },
      { path: "hluttawId" },
    ]);

    return res.status(201).json({
      status: true,
      message: "Create Post Successfully!",
      data: {
        id: post._id,
        hluttawTime: post.hluttawId.time,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.name),
        committee: post.committeeId?.name || null,
        viewCount: post.viewCount,
        viewRating: post.viewRating,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in create post!";
  }
};

export const detailPost = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id).populate([
      { path: "author" },
      { path: "committeeId" },
      { path: "hluttawId" },
      { path: "tags" },
    ]);
    if (!post) {
      const error = new Error("Post not found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    post.viewCount += 1;
    post.viewRating = Math.min(5, post.viewCount / 50);
    await post.save();
    res.status(200).json({
      status: true,
      message: "Post fetched successfully!",
      data: {
        id: post._id,
        hluttawTime: post.hluttawId.time,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.name),
        committee: post.committeeId?.name || null,
        viewCount: post.viewCount,
        viewRating: post.viewRating,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching post detail!";
    throw error;
  }
};

export const updatePost = async (req, res) => {
  try {
    const files = req.files;
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error("Post not found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("User not authorized to update this post!");
      error.status = false;
      error.statusCode = 401;
      throw error;
    }

    if (files && files.length > 0) {
      // Delete old files
      post.imageUrl.forEach((filePath) => {
        const fullPath = path.join(process.cwd(), filePath); // ✅ use path.join
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      // Replace with new images
      post.imageUrl = files.map((file) => `/uploads/News/${file.filename}`);
    }

    let { title, content, tags, hluttawId, committeeId } = req.body;

    tags = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").filter(Boolean)
      : post.tags;

    post.title = title || post.title;
    post.content = content || post.content;
    post.hluttawId = hluttawId || post.hluttawId;
    post.committeeId = committeeId || post.committeeId;
    post.tags = tags || post.tags;

    if (!files) {
      post.imageUrl = post.imageUrl;
    }

    const updatedPost = await post.save();

    await updatedPost.populate([
      { path: "author" },
      { path: "committeeId" },
      { path: "hluttawId" },
      { path: "tags" },
    ]);
    return res.status(200).json({
      status: true,
      message: "Post updated successfully!",
      data: {
        id: updatedPost._id,
        hluttawTime: updatedPost.hluttawId?.time || null,
        title: updatedPost.title,
        content: updatedPost.content,
        imageUrl: updatedPost.imageUrl,
        author: updatedPost.author?.username || null,
        tags: updatedPost.tags?.map((tag) => tag.name) || [],
        committee: updatedPost.committeeId?.name || null,
        viewCount: updatedPost.viewCount,
        viewRating: updatedPost.viewRating,
        createdAt: moment(updatedPost.createdAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
        updatedAt: moment(updatedPost.updatedAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in update post!";
    throw error;
  }
};

export const deletePost = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);

    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error("Post not found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("User not authorized to delete this post!");
      error.statusCode = 401;
      throw error;
    }

    // Delete attached image files
    if (post.imageUrl && post.imageUrl.length > 0) {
      post.imageUrl.forEach((filePath) => {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }
    await Post.deleteOne({ _id: post._id });
    res.status(200).json({
      status: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in delete post!";
    throw error;
  }
};
