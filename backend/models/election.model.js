import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    electionName: { type: String, required: true, trim: true },
    electionShortName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Election = mongoose.model("Election", electionSchema);

export default Election;
