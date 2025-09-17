import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    religion: { type: String, required: true },
    ethnicity: { type: String, required: true },
    materialStatus: { type: String, enum: ['single', 'married'], required: true },
    bachelorDegree: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    photoUrl: { type: String, required: false },
    workExperience: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    townshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Township", required: true },
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
    hluttawId: { type: mongoose.Schema.Types.ObjectId, ref: "Hluttaw", required: true },
    committeeId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Committee", required: false },
      { startDate: { type: String, required: false } },
      { endDate: { type: String, required: false } }
    ]
    ,
    position:[
      { type: mongoose.Schema.Types.ObjectId, ref: "Position" , required: false },
      {startDate : { type: String, required: false }},
      {endDate : { type: String, required: false }}
    ],
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
