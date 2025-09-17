import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Committee name is required!"], // ✅ Custom message
      trim: true,
    },
    shortName: {
      type: String,
      required: [true, "Committee short name is required!"], // ✅ Custom message
      trim: true,
    },
  },
  { timestamps: true }
);


const Committee = mongoose.model("Committee", committeeSchema);

export default Committee;
