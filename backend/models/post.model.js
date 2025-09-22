// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: [{ type: String, required: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    committeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Committee",
      required: false,
    },
    hluttawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hluttaw",
      required: true,
    },
    viewCount: { type: Number, default: 0 },
    viewRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
