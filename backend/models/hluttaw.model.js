import mongoose from "mongoose";

const hluttawSchema = new mongoose.Schema(
  {
    hluttawTime: { type: String, required: true, trim: true },
    hluttawShortTime: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Hluttaw = mongoose.model("Hluttaw", hluttawSchema);

export default Hluttaw;
