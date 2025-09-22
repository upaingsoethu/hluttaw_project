import fs from "fs";
import path from "path";
import moment from "moment/moment.js";
import User from "../models/auth.model.js";
import { getInitialsUsername } from "../helpers/username.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokens.js";
import {
  redisStoreRefreshToken,
  redisDeleteRefreshToken,
} from "../helpers/redis.js";
import {
  accessTokenStoreCookies,
  refreshTokenStoreCookies,
  deleteCookies,
} from "../helpers/cookies.js";
import { loginValidation, mongoIdValidaton } from "../helpers/validation.js";

moment.locale("my");

// Get all users
export const userList = async (req, res) => {
  try {
    const users = await User.find().sort({ loginAt: -1 });
    if (users.length === 0) {
      const error = new Error("No users found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "User list fetched successfully!",
      data: users.map((user) => ({
        id: user._id,
        username: user.username,
        profileInitial: getInitialsUsername(user.username),
        profile: user.profile,
        email: user.email,
        roles: user.roles,
        status: user.status,
        loginAt: moment(user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
        createdAt: moment(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
      })),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetch user list!";
    throw error;
  }
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.register(username, email, password);
    if (user) {
      return res.status(201).json({
        status: true,
        message: "User register successfully!",
        data: {
          id: user._id,
          username: user.username,
          profileInitial: getInitialsUsername(user.username),
          profile: user.profile,
          email: user.email,
          roles: user.roles,
          status: user.status,
          loginAt: moment(user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
        },
      });
    } else {
      const error = new Error("User registration failed!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in user registration!";
    throw error;
  }
};

//  Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginValidation(email, password);

    const user = await User.login(email, password);

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Update user login info
    user.status = "active";
    user.loginAt = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    await redisStoreRefreshToken(user, refreshToken);
    await accessTokenStoreCookies(res, accessToken);
    await refreshTokenStoreCookies(res, refreshToken);

    res.status(200).json({
      status: true,
      message: "User logged in successfully!",
      data: {
        id: user._id,
        username: user.username,
        profileInitial: getInitialsUsername(user.username),
        profile: user.profile,
        email: user.email,
        roles: user.roles,
        status: user.status,
        loginAt: moment(user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
        refresh_token: refreshToken,
        access_token: accessToken,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in user login!";
    throw error;
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {

    const file = req.file; // get file from multer middleware;
    const { username, email, roles, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    //  check new profile image
    if (file) {
      //check old profile image and delete
      if (user.profile) {
        const oldPath = path.join(process.cwd(), user.profile);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profile = `/uploads/User_Profiles/${file.filename}`;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.roles = roles || user.roles;
    user.status = status || user.status;

    await user.save();
    res.status(200).json({
      status: true,
      message: "User profile updated successfully!",
      data: {
        id: user._id,
        username: user.username,
        profileInitial: getInitialsUsername(user.username),
        profile: user.profile,
        email: user.email,
        roles: user.roles,
        status: user.status,
        loginAt: moment(user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in update user profile!";
    throw error;
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    await User.changePassword(userId, currentPassword, newPassword);
    res
      .status(200)
      .json({ status: true, message: "Password changed successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in change password!";
    throw error;
  }
};

//  Logout user
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = null;
    await user.save();
    await redisDeleteRefreshToken(user);
    await deleteCookies(res);
    res.status(200).json({ status: true, message: "Logged out successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in logout!";
    throw error;
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error("User not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    // Delete profile image if exists
    if (user.profile) {
      const oldPath = path.join(process.cwd(), user.profile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await redisDeleteRefreshToken(user);
    await deleteCookies(res);
    res
      .status(200)
      .json({ status: true, message: "User deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting user!";
    throw error;
  }
};

// Access Token Generated Success
export const accessTokenGenerated = async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Access token refreshed successfully!",
    data: {
      id: req.user._id,
      username: req.user.username,
      profileInitial: getInitialsUsername(req.user.username),
      profile: req.user.profile,
      email: req.user.email,
      roles: req.user.roles,
      status: req.user.status,
      loginAt: moment(req.user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
    },
  });
};
