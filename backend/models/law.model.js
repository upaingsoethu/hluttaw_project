import mongoose from "mongoose";

const lawSchema = new mongoose.Schema(
  {
    lawNo: { type: String, required: true },
    description: { type: String, required: true },
    hluttawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hluttaw",
      required: true,
    },
    downloadCount: { type: Number, default: 0 },
    downloadRating: { type: Number, default: 0 },
    uploadedFile: {
      fileName: String,
      filePath: String,
      fileSize: Number,
      fileType: String,
      downloadUrl: String,
    },
  },
  { timestamps: true }
);

const Law = mongoose.model("Law", lawSchema);
export default Law;
