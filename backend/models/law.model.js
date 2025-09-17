import mongoose from "mongoose";

const lawSchema = new mongoose.Schema(
  {
    lawNo: { type: String, required: true },
    description: { type: String, required: true },
    hluttawId: { type: mongoose.Schema.Types.ObjectId, ref: "Hluttaw", required: true },
    downloadUrl: { type: String, required: false },
    downloadCount: { type: Number, default: 0 },
    downloadRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Law = mongoose.model("Law", lawSchema);
export default Law;
