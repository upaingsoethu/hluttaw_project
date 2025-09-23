import validator from "validator";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const registerValidation = async (username, email, password) => {
  if (!username && !email && !password) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  // Validate email format
  if (!validator.isEmail(email)) {
    const error = new Error("Invalid your email format!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  // Validate password strength
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    const error = new Error(
      "Password must be at least 6 characters long & contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol!"
    );
    (error.status = false), (error.statusCode = 400);
    throw error;
  }

  return true;
};

// Login validation
export const loginValidation = async (email, password) => {
  if (!email || !password) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email format!");
    error.statusCode = 400;
    throw error;
  }

  return true;
};

// Capitalization function for username
export const CapitalizationUsername = (username) => {
  try {
    const capitalized = username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return capitalized;
  } catch (error) {
    error.message = "Capitalization username error!";
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
};

//email validaton function
export const emailValidation = async (email) => {
  if (!validator.isEmail(email)) {
    const error = new Error("Invalid your email format!");
    error.status = false;
    error.statusCode = 400;
  }
  return true;
};

//password validation function
export const passwordValidation = async (password) => {
  // Validate password strength
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    const error = new Error(
      "Password must be at least 6 characters long & contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol!"
    );
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// mongoID validation function
export const mongoIdValidaton = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Your ID is invalid!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// committees validaton function
export const committeeValidation = async (hluttawId, name, shortName) => {
  if (!hluttawId || !name || !shortName) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  if (hluttawId) {
    await mongoIdValidaton(hluttawId);
  }
  return true;
};

// election validaton function
export const electionTypesValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// government validaton function
export const governmentValidation = async (
  department,
  departmentShortName,
  governmentName
) => {
  if (!department || !departmentShortName || !governmentName) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// hluttaw validaton function
export const hluttawValidation = async (time, shortTime, period) => {
  if (!time || !shortTime || !period) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// law validaton function
export const lawValidation = async (
  number,
  description,
  remark,
  hluttawId,
  file
) => {
  if (!number || !description || !remark || !hluttawId) {
    const temportyFile = path.join(
      process.cwd(),
      `/uploads/laws/${file.filename}`
    );
    if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  if (hluttawId) {
    await mongoIdValidaton(hluttawId);
  }
  return true;
};

// post validaton function
export const postValidation = async (
  title,
  content,
  tags,
  hluttawId,
  files
) => {
  if (!title || !content || !tags || !hluttawId) {
    // ✅ Files cleanup
    if (files) {
      if (Array.isArray(files)) {
        // Multiple files (req.files)
        files.forEach((file) => {
          const tempFile = path.join(
            process.cwd(),
            `/uploads/news/${file.filename}`
          );
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        });
      } else {
        // Single file (req.file)
        const tempFile = path.join(
          process.cwd(),
          `/uploads/news/${files.filename}`
        );
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    }
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  return true;
};

// tags validation function
export const tagsValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// metting validation function
export const meetingValidation = async (name, shortName, description) => {
  if (!name || !shortName || !description) {
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// party validation function
export const partyValidation = async (name, shortName, file) => {
  if (!name || !shortName) {
    const temportyFile = path.join(
      process.cwd(),
      `/uploads/parties/${file.filename}`
    );
    if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
    const error = new Error("All fields must be filled!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};
