
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {meetingsList,createMeeting, updateMeeting, deleteMeeting } from "../controllers/meeting.controller.js";


const router = express.Router();

router.get("/", meetingsList);
router.post("/", createMeeting);
router.patch("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

export default router;
