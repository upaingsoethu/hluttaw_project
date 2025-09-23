import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

const Party = mongoose.model("Party", partySchema);

export default Party;
