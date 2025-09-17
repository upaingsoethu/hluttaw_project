import Post from "../models/post.model.js";
import paginate from "../helpers/pagination.js";
import { postValidation } from "../helpers/post.validation.js";
import { handleUpload } from "../helpers/upload.js";
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
      { path: "author", select: "username" },
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
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author ? post.author.username : null,
        viewCount: post.viewCount,
        rating: post.rating,
        ratingCount: post.ratingCount,
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
    const { title, content , tags , committeeId , hluttawId } = req.body;
    const check = await postValidation(title, content ,  tags , committeeId , hluttawId);
    if (check) {
      // Step 2: Upload files after validation
      const files = await handleUpload(req, res);

      // Step 3: Extract file paths
      const imagePaths = files.map((file) => file.path);
      const newPost = new Post({
        title,
        content,
        imageUrl: imagePaths,
        tags,
        committeeId,
        author: req.user._id,
      });
      const post = await newPost.save();
      await post.populate([
        { path: "author", select: "username" },
        { path: "committeeId", select: "name" },
        { path: "tags", select: "name" },
      ]);
      res.status(201).json({
        status: true,
        message: "Create Post Successfully!",
        data: [post].map((post) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl.map((img) => img),
          tags: post.tags.map((tag) => tag),
          committeeId: post.committeeId,
          author: post.author.username,
          viewCount: post.viewCount,
          rating: post.rating,
          ratingCount: post.ratingCount,
          createdAt: moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
          updatedAt: moment(post.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
        })),
      });
    }
    const error = new Error("Post creation failed!");
    error.statusCode = 400;
    throw error;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating post!";
    throw error;
  }
};

export const detailPost = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      throw error;
    }
    post.viewCount += 1;
    post.rating = Math.min(5,post.viewCount / 50);    
    await post.save();
    res.status(200).json({
      status: true,
      message: "Post fetched successfully!",
      data: [post].map((post) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        viewCount: post.viewCount,
        rating: post.rating,
        ratingCount: post.ratingCount,
      })),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching post!";
    throw error;
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.author.toString() !== req.user._id.toString()) {
        const error = new Error("User not authorized to update this post!");
        error.statusCode = 401;
        throw error;
      }
      post.title = title || post.title;
      post.content = content || post.content;
      const updatedPost = await post.save();
      await updatedPost.populate("author", "username");
      res.status(200).json({
        status: true,
        message: "Post updated successfully!",
        data: [updatedPost].map((post) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          author: post.author.username,
          createdAt: moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
          updatedAt: moment(post.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
        })),
      });
    }
    const error = new Error("Post not found!");
    error.statusCode = 404;
    throw error;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating post!";
    throw error;
  }
};

export const deletePost = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.author.toString() !== req.user._id.toString()) {
        const error = new Error("User not authorized to delete this post!");
        error.statusCode = 401;
        throw error;
      }
      await Post.deleteOne({ _id: post._id });
      res.status(200).json({ status: true, message: "Post deleted successfully!" });
    } else {
     const error = new Error("Post not found!");
     error.statusCode = 404;
     throw error;
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting post!";
    throw error;
  }
};


