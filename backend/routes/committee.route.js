// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {  committesList, createCommittee, deleteCommittee, updateCommittee } from "../controllers/committee.controller.js";

const router = express.Router();

router.get("/" , committesList);
router.post("/", createCommittee);
router.patch("/:id", updateCommittee);
router.delete("/:id", deleteCommittee);


export default router;
