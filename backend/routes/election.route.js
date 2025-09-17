// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createElection, deleteElection,  electionsList , updateElection } from "../controllers/election.controller.js";

const router = express.Router();

router.get("/" , electionsList);
router.post("/", createElection);
router.patch("/:id", updateElection);
router.delete("/:id", deleteElection);


export default router;
