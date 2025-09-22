import validator from "validator";
import mongoose from "mongoose";

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
export const lawValidation = async (number, description, remark, hluttawId) => {
  if (hluttawId) {
    await mongoIdValidaton(hluttawId);
  }
  if (!number || !description || !remark || !hluttawId) {
    const error = new Error(
      "Law number and description and remark & Hlutaw Time fields are required!"
    );

    error.status = false;
    error.statusCode = 400;
    throw error;
  }
  return true;
};

// post validaton function
export const postValidation = async (title, content, tags, hluttawId) => {
  if (!title || !content || !tags || !hluttawId) {
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
