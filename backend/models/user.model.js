import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  CapitalizationUsername,
  emailValidation,
  passwordValidation,
  registerValidation,
  loginValidation
} from "../helpers/validation.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    profile: { type: String, required: false, default: null },
    roles: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    loginAt: { type: Date, required: true },
    refreshToken: String,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// 🔹 Pre-save hook: username, email, password
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("username")) {
      this.username = await CapitalizationUsername(this.username);
    }
    if (this.isModified("email")) {
      await emailValidation(this.email);
    }
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// static register method
userSchema.statics.register = async function (username, email, password) {
  // Validate user input
  await registerValidation(username, email, password);

  // Check if email already exists
  const exists = await this.findOne({ email });

  if (exists) {
    const error = new Error("Email already in use!");
    error.statusCode = 400;
    throw error;
  }

  // Create new user
  const user = await this.create({
    username,
    email,
    password,
    roles: "user",
    status: "pending",
    loginAt: Date.now(),
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  //Validation check email and password

  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Incorrect email!");
    error.statusCode = 404;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Incorrect password!");
    error.statusCode = 400;
    throw error;
  }

  return user;
};

// 🔹 Static method: changePassword
userSchema.statics.changePassword = async function (
  userId,
  currentPassword,
  newPassword
) {
  const user = await this.findById(userId).select("+password");
  if (!user) {
    const error = new Error("User not found!");
    error.statusCode = 400;
    throw error;
  }
  if(newPassword){
    await passwordValidation(newPassword);
  }
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) 
  {
    const error = new Error("Current password incorrect!");
    error.statusCode = 400;
    throw error;
  }
    
  user.password = newPassword;
  await user.save();
  return true;
};

export default mongoose.model("User", userSchema);
