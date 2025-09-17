import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["ကြယ်ပွင့်ပြ", "ကြယ်ပွင့်မပြ", "အဆို"],
      required: true,
    },
    volter: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: false },
      { discussion: { type: String, required: false } },
    ],
    government: [
      {
        ministerName: { type: String, required: true },
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Government",
        required: true,
      },
      { answerforQuestion: { type: String, required: true } },
    ],
    viewCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    hluttawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hluttaw",
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
