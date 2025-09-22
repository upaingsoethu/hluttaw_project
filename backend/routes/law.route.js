// routes/postRoutes.js
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
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", LawsList);
router.get("/download/:id", downloadLaw);
router.get("/:id", detailLaw);
router.post("/", upload.single("Law"), createLaw);
router.patch("/:id", upload.single("Law"),updateLaw);
router.delete("/:id", deleteLaw);

export default router;
