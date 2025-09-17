// libraries
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


// helpers
import {
  CapitalizationUsername,
  registerValidation,
} from "../helpers/validation.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password field by default when querying
    },
    profileImage: { type: String, required: false },
    roles: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    account_status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    loginAt: {
      type: Date,
      required: true,
    },
    refreshToken: String, // Store refresh tokens
  },
  { timestamps: { createdAt: true, updatedAt: false} }
);

//pre save hook for username to Capitalization
userSchema.pre("save", async function (next) {
  if (!this.isModified("username")) {
    return next();
  }
  // Capitalize function
  this.username = await CapitalizationUsername(this.username);
  next();
});



//pre save hook for password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
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
    account_status: "pending",
    loginAt: Date.now(),
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  //Validation check email and password
  
  const user = await this.findOne({ email }).select("+ password");
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

const User = new mongoose.model("User", userSchema);
export default User;

