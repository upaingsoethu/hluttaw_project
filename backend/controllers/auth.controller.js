// controllers/authController.js
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokens.js";
import {
  redisDeleteRefreshToken,
  redisStoreRefreshToken,
} from "../helpers/redis.js";
import {
  accessTokenStoreCookies,
  refreshTokenStoreCookies,
  deleteCookies,
} from "../helpers/cookies.js";
import moment from "moment/moment.js";
import { loginValidation, mongoIdValidaton } from "../helpers/validation.js";

moment.locale("my");

const userList = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "_id username email roles account_status loginAt"
    ).sort({
      createdAt: -1,
    });
    if (users.length === 0) {
      const error = new Error("No users found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: true,
      message: "User list retrieved successfully!",
      data: users.map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        account_status: user.account_status,
        loginAt: moment(user.loginAt).format("DD-MM-YYYY HH:mm:ss"),
      })),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching user list!";
    throw error;
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //new user register
    const user = await User.register(username, email, password);

    if (user) {
      return res.status(201).json({
        status: true,
        message: "User register successfully!",
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.roles,
          status: user.status,
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
    error.message = "Server Error in user registration";
    throw error;
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check validation
    await loginValidation(email, password);
    //login user
    const user = await User.login(email, password);
    // If user is found and password matches
    if (user) {
      const accessToken = await generateAccessToken(user._id); //life time 15 min
      const refreshToken = await generateRefreshToken(user._id); // life time 7 days
      //update user status pending to active and restore refresh token
      user.refreshToken = refreshToken;
      user.account_status = "active";
      // Save the updated user document
      await user.save();
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            account_status: "active",
            loginAt: new Date(),
            refreshToken: refreshToken,
          },
        },
        { new: true }
      );
      await user.save();
      // Store refresh token in Redis
      await redisStoreRefreshToken(user, refreshToken);
      // Store cookies for access Token and refresh Token
      await accessTokenStoreCookies(res, accessToken);
      await refreshTokenStoreCookies(res, refreshToken);

      res.status(200).json({
        status: true,
        message: "User login successfully!",
        data: {
          _id: updateUser._id,
          username: updateUser.username,
          email: updateUser.email,
          role: updateUser.roles,
          account_status: updateUser.account_status,
          refresh_token: updateUser.refreshToken,
          access_token: accessToken,
          // refresh_token: refreshToken,
        },
      });
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in user login!";
    throw error;
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    //check if refresh token exists
    if (!refreshToken) {
      const error = new Error("Refresh token not found in cookies!");
      error.statusCode = 400;
      throw error;
    }
    // req user check by id from protect middleware
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }
    // Remove refresh token from MongoDB
    user.refreshToken = null;
    await user.save();
    // Remove from Redis as well
    await redisDeleteRefreshToken(user);
    //Remove Cookies
    await deleteCookies(res);
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in user logout!";
    throw error;
  }
};

const deleteUser = async (req , res)=>{
  try {
    await mongoIdValidaton(req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 400;
      throw error;
    }
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
}


const accessTokenGenerated = async (req, res) => {
  // This is handled by the refreshTokenMiddleware, if it passes, a new access token is already set in the cookie
  res.status(200).json({
    status: true,
    message: "Access token refreshed successfully!",
    data: {
      user: req.user.username,
      email: req.user.email,
      access_token: req.accessToken,
    },
  });
};

export { userList, registerUser, loginUser, logoutUser, deleteUser, accessTokenGenerated };

// if (error.name === "ValidationError") {
//   const errors = {};
//   for (const field in error.errors) {
//     errors[field] = error.errors[field].message;
//   }
//   return res.status(400).json({ status: false, message: errors }); // Validation error
// } else {
//   return res
//     .status(500)
//     .json({ status: false, message: "Server error", error: error.message });
// }
