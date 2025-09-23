
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  LawsList,
  createLaw,
  updateLaw,
  deleteLaw,
  detailLaw,
  downloadLaw,
} from "../controllers/law.controller.js";
import { lawUploadMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", LawsList);
router.get("/download/:id", downloadLaw);
router.get("/:id", detailLaw);
router.post("/", lawUploadMiddleware, createLaw);
router.patch("/:id", lawUploadMiddleware,updateLaw);
router.delete("/:id", deleteLaw);

export default router;
