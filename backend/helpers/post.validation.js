import mongoose from "mongoose";

export const postValidation = async (title, content , imageUrl , tags , committeeId , hluttawId) => {
  if (!title && content) {
    const error = new Error("Title field is required!");
    error.statusCode = 400;
    throw error;
  }
  if (!content && title) {
    const error = new Error("Content field is required!");
    error.statusCode = 400;
    throw error;
  }
  if (!title && !content) {
    const error = new Error("Title and content fields are required!");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Image URL Validation
  if (!Array.isArray(imageUrl) || imageUrl.length === 0) {
    const error = new Error("At least one image is required!");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Tags Validation (must be array of valid ObjectIds)
  if (!Array.isArray(tags) || tags.length === 0) {
    const error = new Error("At least one tag is required!");
    error.statusCode = 400;
    throw error;
  }
  
  if(hluttawId && !mongoose.Types.ObjectId.isValid(hluttawId)) {
    const error = new Error("HluttawId must be a valid MongoDB ObjectId!");
    error.statusCode = 400;
    throw error;
  }
  // ✅ CommitteeId (optional but must be valid ObjectId if provided)
  if (committeeId && !mongoose.Types.ObjectId.isValid(committeeId)) {
    const error = new Error("CommitteeId must be a valid MongoDB ObjectId!");
    error.statusCode = 400;
    throw error;
  }
  return true;
};

