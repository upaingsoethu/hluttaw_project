import mongoose from "mongoose";

const governmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Government = mongoose.model("Government", governmentSchema);

export default Government;
