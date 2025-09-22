import mongoose from "mongoose";

const electionTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    description:{ type : String , required : true, trim: true}
  },
  { timestamps: true }
);

const ElectionTypes = mongoose.model("ElectionTypes", electionTypeSchema);

export default ElectionTypes;
