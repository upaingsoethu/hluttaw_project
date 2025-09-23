
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { partyUploadMiddleware} from "../middleware/upload.middleware.js";
import { createParty, deleteParty, partiesList, updateParty } from "../controllers/parties.controller.js";


const router = express.Router();

router.get("/", partiesList);
router.post("/", partyUploadMiddleware, createParty);
router.patch("/:id", partyUploadMiddleware, updateParty);
router.delete("/:id", deleteParty);

export default router;
