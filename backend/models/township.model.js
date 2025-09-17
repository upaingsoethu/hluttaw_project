import mongoose from 'mongoose';
const townshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: {
      type: String,
      enum: ["ပုသိမ်ခရိုင်", "ကျုံပျော်ခရိုင်", "ဟင်္သာတခရိုင်","မြန်အောင်ခရိုင်","မအူပင်ခရိုင်","မြောင်းမြခရိုင်","ဖျာပုံခရိုင်","လပွတ္တာခရိုင်"],
      required: true,
    },
  },
  { timestamps: true }
);

const Township = mongoose.model('Township', townshipSchema);

export default Township;
