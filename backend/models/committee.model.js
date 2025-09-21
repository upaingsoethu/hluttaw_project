import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    hluttawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hluttaw",
      required: true,
    },
  },
  { timestamps: true }
);

const Committee = mongoose.model("Committee", committeeSchema);

export default Committee;
