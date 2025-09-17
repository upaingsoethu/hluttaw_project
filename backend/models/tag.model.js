import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagName: { type: String, required: true },
    tagShortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
