import validator from "validator";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const registerValidation = async (username, email, password) => {
  if (!username && email && password) {
    const error = new Error("Username field is required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (username && !email && password) {
    const error = new Error("Email field is required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (username && email && !password) {
    const error = new Error("Password field is required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (!username && !email && !password) {
    const error = new Error(
      "Username and Email and Password fields are required!"
    );
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (!username && !email && password) {
    const error = new Error("Username and Email fields are required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  if (!username && email && !password) {
    const error = new Error("Username and Password fields are required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (username && !email && !password) {
    const error = new Error("Email and Password fields are required!");
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
  if (!email && password) {
    const error = new Error("Email is required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  if (email && !password) {
    const error = new Error("Password is required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  if (!email && !password) {
    const error = new Error("Email and password are required!");
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
    if (username) {
      const capitalized = username
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      return capitalized;
    } else {
      const error = new Error("Username is required for capitalization!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    error = new Error("Error in capitalizing username!");
    error.statusCode = 500;
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
    const error = new Error(
      "Hluttaw Time & Committee Name and ShortName fields are required!"
    );
    if (hluttawId) {
      await mongoIdValidaton(hluttawId);
    }
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// election validaton function
export const electionTypesValidation = async (name, shortName, description) => {
  if (!name || !shortName) {
    const error = new Error(
      "Election Name and ShortName & Description fields are required!"
    );
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
    const error = new Error(
      "Departments Name and ShortName & Government Name fields are required!"
    );
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// hluttaw validaton function
export const hluttawValidation = async (time, shortTime, period) => {
  if (!time || !shortTime || !period) {
    const error = new Error(
      "Hluttaw time and shortTime & period fields are required!"
    );
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// law validaton function
export const lawValidation = async (number, description, remark, hluttawId , file) => {
  if (hluttawId) {
    await mongoIdValidaton(hluttawId);
  }
  if (!number || !description || !remark || !hluttawId) {
    const temportyFile = path.join(process.cwd(),`/uploads/Laws/${file.filename}`);
    if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
    const error = new Error(
      "Law no and description and remark & hlutaw time fields are required!"
    );

    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// post validaton function
export const postValidation = async (title, content, tags, hluttawId , files) => {
  if (!title || !content || !tags || !hluttawId) {
    // ✅ Files cleanup
    if (files) {
      if (Array.isArray(files)) {
        // Multiple files (req.files)
        files.forEach((file) => {
          const tempFile = path.join(
            process.cwd(),
            `/uploads/News/${file.filename}`
          );
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        });
      } else {
        // Single file (req.file)
        const tempFile = path.join(
          process.cwd(),
          `/uploads/News/${files.filename}`
        );
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    }
    const error = new Error(
      "Title and Content and  Tags and Hluttaw Time fields are required!"
    );
    error.status = false;
    error.statusCode = 400;
    throw error;
  }

  return true;
};

// tags validation function
export const tagsValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("Tag Name and ShortName fields are required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// metting validation function
export const meetingValidation = async (name, shortName , description) => {
  if (!name || !shortName || !description) {
    const error = new Error("Meeting name and shortName & description fields are required!");
    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// party validation function
export const partyValidation = async (name, shortName , file ) => {
  if (!name || !shortName ) {
   const temportyFile = path.join(
     process.cwd(),
     `/uploads/Party/${file.filename}`
   );
   if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
    const error = new Error("Party name and shortName fields are required!");
    error.status = false;
    error.statusCode = 400;

    throw error;
  }
  return true;
};