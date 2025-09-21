// routes/postRoutes.js
import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createDepartment, deleteDepartment, departmentsList, updateDepartment } from "../controllers/government.controller.js";

const router = express.Router();

router.get("/" , departmentsList);
router.post("/", createDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);


export default router;
