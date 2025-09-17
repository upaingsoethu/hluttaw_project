// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createTag, updateTag, deleteTag, tagsList} from "../controllers/tags.controller.js"
const router = express.Router();

router.get("/" , tagsList);
router.post("/", createTag);
router.patch("/:id", updateTag);
router.delete("/:id", deleteTag);


export default router;
