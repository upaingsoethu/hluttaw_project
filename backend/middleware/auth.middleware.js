import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/auth.model.js";
import {redisGetRefreshToken} from "../helpers/redis.js"
import { generateAccessToken } from "../helpers/tokens.js";
import { accessTokenStoreCookies } from "../helpers/cookies.js";
dotenv.config();

export const checkAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    const error = new Error("Access token is required!");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      const error = new Error("Access token is expired!");
      error.statusCode = 401;
      throw error;
    }
    error.message = "Invalid access token!";
    error.statusCode = 401;
    throw error;
  }
};

// Middleware to refresh access token using refresh token
export const checkRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    const error = new Error("Refresh token is required!");
    error.statusCode = 401;
    throw error;
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    const redisRefreshToken = await redisGetRefreshToken(user);

    if (user.refreshToken !== redisRefreshToken) {
      const error = new Error("MongoDB refresh token and Redis refresh token do not match!");
      error.statusCode = 401;
      throw error;
    }

    // If refresh token is valid, generate new access token
    const accessToken = await generateAccessToken(user._id);
    
    //Store cookies for access Token and refresh Token
    await accessTokenStoreCookies(res, accessToken);
    req.user = user;
    req.accessToken = accessToken; // Attach user to request
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      const error = new Error("Refresh token is expired!");
      error.statusCode = 401;
      throw error;
    }
    error.message = "Invalid refresh token!";
    error.statusCode = 401;
    throw error;
  }

};

