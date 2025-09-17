// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createHluttaw, deleteHluttaw, hluttawList, updateHluttaw } from "../controllers/hluttaw.controller.js";



const router = express.Router();

router.get("/" , hluttawList);
router.post("/", createHluttaw);
router.patch("/:id", updateHluttaw);
router.delete("/:id", deleteHluttaw);


export default router;
