import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Election = mongoose.model("Election", electionSchema);

export default Election;
