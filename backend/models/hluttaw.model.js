import mongoose from "mongoose";

const hluttawSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    shortTime: { type: String, required: true, trim: true },
    period: { type: String, require: true, trim: true },
  },
  { timestamps: true }
);

const Hluttaw = mongoose.model("Hluttaw", hluttawSchema);

export default Hluttaw;
