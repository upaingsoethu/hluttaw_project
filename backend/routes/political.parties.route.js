
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { createParty, deleteParty, partiesList, updateParty } from "../controllers/parties.controller.js";


const router = express.Router();

router.get("/", partiesList);
router.post("/", upload.single("party"), createParty);
router.patch("/:id", upload.single("party"), updateParty);
router.delete("/:id", deleteParty);

export default router;
