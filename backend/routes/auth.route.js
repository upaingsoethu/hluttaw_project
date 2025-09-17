// routes/authRoutes.js
import express from 'express';
import {
  userList,
  registerUser,
  loginUser,
  logoutUser,
  accessTokenGenerated,
  deleteUser,
} from "../controllers/auth.controller.js";
import {checkAuth , checkRefreshToken} from "../middleware/auth.middleware.js"// Import the authentication middleware
//import { configureUploadAndHandle } from '../middleware/uploadMiddleware.js'; // Import the upload middleware


const router = express.Router();  
// Define routes for authentication
// Use the upload middleware for user registration to handle profile image uploads
router.get('/users',  userList);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', checkAuth,  logoutUser); // protect to get req.user._id for refresh token cleanup
router.delete('/:id', deleteUser);
router.get("/refreshAccessToken", checkRefreshToken, accessTokenGenerated);

export default router;