import mongoose from "mongoose";

const lawSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    remark: { type: String, require: true, trim: true },
    hluttawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hluttaw",
      required: true,
    },
    viewCount: { type: String, default: 0 },
    viewRating: { type: Number, default: 0 },
    downloadUrl: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Law = mongoose.model("Law", lawSchema);
export default Law;
