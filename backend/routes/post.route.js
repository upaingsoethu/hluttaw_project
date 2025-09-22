// routes/postRoutes.js
import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  detailPost,
  postsList,
} from "../controllers/post.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/upload.middleware.js"
const router = express.Router();

router.get("/", postsList);
router.get("/:id", detailPost);
router.post("/", checkAuth, upload.array("photos", 5), createPost);
router.patch("/:id", checkAuth, upload.array("photos", 5),updatePost);
router.delete("/:id", checkAuth, deletePost);

// router.route("/").post(protect, createPost).get(getPosts);
// router
//   .route("/:id")
//   .get(getPostById)
//   .put(protect, updatePost)
//   .delete(protect, deletePost);

export default router;
