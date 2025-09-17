import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);

export default Position;
