// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createLaw, deleteLaw, LawsList, updateLaw } from "../controllers/law.controller.js";


const router = express.Router();

router.get("/" , LawsList);
router.post("/", createLaw);
router.patch("/:id", updateLaw);
router.delete("/:id", deleteLaw);


export default router;
