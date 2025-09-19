import validator from "validator";
import mongoose from "mongoose";

export const registerValidation = async (username, email, password) => {
  if (!username && email && password) {
    const error = new Error("Username field is required!");
    error.statusCode = 400;
    throw error;
  }

  if (username && !email && password) {
    const error = new Error("Email field is required!");
    error.statusCode = 400;
    throw error;
  }

  if (username && email && !password) {
    const error = new Error("Password field is required!");
    error.statusCode = 400;
    throw error;
  }

  if (!username && !email && !password) {
    const error = new Error(
      "Username and Email and Password fields are required!"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!username && !email && password) {
    const error = new Error("Username and Email fields are required!");
    error.statusCode = 400;
    throw error;
  }
  if (!username && email && !password) {
    const error = new Error("Username and Password fields are required!");
    error.statusCode = 400;
    throw error;
  }

  if (username && !email && !password) {
    const error = new Error("Email and Password fields are required!");
    error.statusCode = 400;
    throw error;
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email format!");
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
    error.statusCode = 400;
    throw error;
  }

  return true;
};

// Login validation
export const loginValidation = async (email, password) => {
  if (!email && password) {
    const error = new Error("Email is required!");
    error.statusCode = 400;
    throw error;
  }
  if (email && !password) {
    const error = new Error("Password is required!");
    error.statusCode = 400;
    throw error;
  }

  if (!email && !password) {
    const error = new Error("Email and password are required!");
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
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    error = new Error("Error in capitalizing username!");
    error.statusCode = 500;
    throw error;
  }
};



// mongoID validation
export const mongoIdValidaton = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID is invalid!");
    error.statusCode = 400;
    throw error;
  }
  return true;
};

export const postValidation = async (title, content, tags,  hluttawId ) => {
  if (!title || !content || !tags || !hluttawId ) {
    const error = new Error(
      "Title and Content and  Tags and Hluttaw fields are required!"
    );
    error.statusCode = 400;
    throw error;
  }
  
  return true;
};





// committees validaton 
export const committeeValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("CommitteeName and Committee ShortName fields are required!");
    error.statusCode = 400;
    throw error;
  }
  return true;
}

// election validaton 
export const electionValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("Election Name and Election ShortName fields are required!");
    error.statusCode = 400;
    throw error;
  }
  return true;
}

// tags validaton 
export const tagsValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("Tag Name and Tag ShortName fields are required!");
    error.statusCode = 400;
    throw error;
  }
  return true;
}

// government validaton 
export const governmentValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("Government Name and Government ShortName fields are required!");
    error.statusCode = 400;
    throw error;
  }
  return true;
}

// government validaton 
export const hluttawValidation = async (name, shortName) => {
  if (!name || !shortName) {
    const error = new Error("Hluttaw Time and Hluttaw ShortTime fields are required!");
    error.statusCode = 400;
    throw error;
  }
  return true;
}

// law validaton 
export const lawValidation = async (lawNo, lawDescription, hluttawId) => {
  if (!lawNo || !lawDescription || !hluttawId) {
    const error = new Error(
      "Law.No and Law Description and Hluttaw Time fields are required!"
    );
    error.statusCode = 400;
    throw error;
  }
  return true;
};