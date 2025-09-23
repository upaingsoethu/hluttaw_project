// routes/authRoutes.js
import express from "express";
import {
  userList,
  registerUser,
  loginUser,
  logoutUser,
  accessTokenGenerated,
  deleteUser,
  updateUser,
  changePassword,
} from "../controllers/auth.controller.js";
import { checkAuth, checkRefreshToken } from "../middleware/auth.middleware.js"; // Import the authentication middleware
import { authUploadMiddleware} from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/users", userList);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", checkAuth, logoutUser);
router.patch("/change-password", checkAuth, changePassword);
router.patch("/user/:id", authUploadMiddleware ,updateUser);
router.delete("/user/:id", deleteUser);
router.get("/refreshAccessToken", checkRefreshToken, accessTokenGenerated);

export default router;
