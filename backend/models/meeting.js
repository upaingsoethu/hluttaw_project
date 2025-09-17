import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingName: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
