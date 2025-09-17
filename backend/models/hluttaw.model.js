import mongoose from "mongoose";

const hluttawSchema = new mongoose.Schema(
  {
    hluttawTime: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Hluttaw = mongoose.model("Hluttaw", hluttawSchema);

export default Hluttaw;
