import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    logoUrl: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const Party = mongoose.model("Party", partySchema);

export default Party;
