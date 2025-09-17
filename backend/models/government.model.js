import mongoose from "mongoose";

const governmentSchema = new mongoose.Schema(
  {
    governmentName: { type: String, required: true, trim: true },
    governmentShortName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Government = mongoose.model("Government", governmentSchema);

export default Government;
