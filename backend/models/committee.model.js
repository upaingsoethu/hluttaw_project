import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    committeeName: {
      type: String,
      required: true,
      trim: true,
    },
    committeeShortName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);


const Committee = mongoose.model("Committee", committeeSchema);

export default Committee;
