// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  createElectionTypes,
  deleteElectionTypes,
  electionsTypes,
  updateElectionTypes,
} from "../controllers/electiontypes.controller.js";

const router = express.Router();

router.get("/" , electionsTypes);
router.post("/", createElectionTypes);
router.patch("/:id", updateElectionTypes);
router.delete("/:id", deleteElectionTypes);


export default router;
