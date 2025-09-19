import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";
import paginate from "../helpers/pagination.js";
import { postValidation } from "../helpers/validation.js";
import { handlePostUpload } from "../helpers/upload.js";
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
        { path: "author", select: "username" },
        { path: "hluttawId", select: "hluttawTime" },
        { path: "tags", select: "tagName" },
        { path: "committeeId", select: "committeeName" },
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
        hluttawTime: post.hluttawId.hluttawTime,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.tagName),
        committee: post.committeeId?.committeeName || null,
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
    //handle file upload for news photos
    const files = await handlePostUpload(req, res);

    let { title, content, tags, hluttawId, committeeId } = req.body;
    //tags data check for array or string. String to array by split
    tags = tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [];
    //check post validation
    await postValidation(title, content, tags, hluttawId);
    //handle file upload for post images

    if (!files || files.length === 0) {
      const error = new Error("Please upload at least one image for the post!");
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
      { path: "author", select: "username" },
      { path: "committeeId", select: "committeeName" },
      { path: "tags", select: "tagName" },
    ]);

    return res.status(201).json({
      status: true,
      message: "Create Post Successfully!",
      data: {
        id: post._id,
        hluttawTime: post.hluttawId.hluttawTime,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.tagName),
        committee: post.committeeId?.committeeName || null,
        viewCount: post.viewCount,
        rating: post.rating,
        ratingCount: post.ratingCount,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Server Error in creating post!",
    });
  }
};

export const detailPost = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id).populate([
      { path: "author", select: "username" },
      { path: "committeeId", select: "committeeName" },
      { path: "hluttawId", select: "hluttawTime" },
      { path: "tags", select: "tagName" },
    ]);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      throw error;
    }
    post.viewCount += 1;
    post.rating = Math.min(5, post.viewCount / 50);
    await post.save();
    res.status(200).json({
      status: true,
      message: "Post fetched successfully!",
      data: {
        id: post._id,
        hluttawTime: post.hluttawId.hluttawTime,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.tagName),
        committee: post.committeeId?.committeeName || null,
        viewCount: post.viewCount,
        rating: post.rating,
        ratingCount: post.ratingCount,
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
    // 1️⃣ Validate post ID
    await mongoIdValidaton(req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      throw error;
    }

    // 2️⃣ Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("User not authorized to update this post!");
      error.statusCode = 401;
      throw error;
    }

    // 3️⃣ Handle new file upload
    const files = (await handlePostUpload(req, res)) || [];

    if (files.length > 0) {
      // Delete old files
      post.imageUrl.forEach((filePath) => {
        const fullPath = path.join(process.cwd(), filePath); // ✅ use path.join
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      // Replace with new images
      post.imageUrl = files.map((file) => `/uploads/News/${file.filename}`);
    }

    // 4️⃣ Extract body fields
    let { title, content, tags, hluttawId, committeeId } = req.body;

    // 5️⃣ Safe tags conversion (string -> array)
    tags = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").filter(Boolean)
      : post.tags;

    // 6️⃣ Update other fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.hluttawId = hluttawId || post.hluttawId;
    post.committeeId = committeeId || post.committeeId;
    post.tags = tags || post.tags;

    // 7️⃣ Save post
    const updatedPost = await post.save();

    // 8️⃣ Populate references
    await updatedPost.populate([
      { path: "author", select: "username" },
      { path: "committeeId", select: "committeeName" },
      { path: "hluttawId", select: "hluttawTime" },
      { path: "tags", select: "tagName" },
    ]);

    // 9️⃣ Return response
    return res.status(200).json({
      status: true,
      message: "Post updated successfully!",
      data: {
        id: updatedPost._id,
        hluttawTime: updatedPost.hluttawId?.hluttawTime || null,
        title: updatedPost.title,
        content: updatedPost.content,
        imageUrl: updatedPost.imageUrl, // ✅ only new images
        author: updatedPost.author?.username || null,
        tags: updatedPost.tags?.map((tag) => tag.tagName) || [],
        committee: updatedPost.committeeId?.committeeName || null,
        viewCount: updatedPost.viewCount,
        rating: updatedPost.rating,
        ratingCount: updatedPost.ratingCount,
        createdAt: moment(updatedPost.createdAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
        updatedAt: moment(updatedPost.updatedAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
      },
    });
  } catch (error) {
    console.error("Update post error:", error);
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Server Error in updating post!",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    // 1️⃣ Validate post ID
    await mongoIdValidaton(req.params.id);

    // 2️⃣ Find post
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      throw error;
    }

    // 3️⃣ Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("User not authorized to delete this post!");
      error.statusCode = 401;
      throw error;
    }

    // 4️⃣ Delete attached image files
    if (post.imageUrl && post.imageUrl.length > 0) {
      post.imageUrl.forEach((filePath) => {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // 5️⃣ Delete post from DB
    await Post.deleteOne({ _id: post._id });

    // 6️⃣ Return success response
    res.status(200).json({
      status: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Server Error in deleting post!",
    });
  }
};
