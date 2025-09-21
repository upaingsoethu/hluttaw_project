import mongoose from "mongoose";

const governmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true, trim: true },
    departmentShortName: { type: String, required: true, trim: true },
    governmentName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Government = mongoose.model("Government", governmentSchema);

export default Government;
