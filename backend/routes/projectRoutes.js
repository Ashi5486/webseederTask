import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectsForMember,
  assignMembers,
} from "../controllers/projectController.js";
import { protect, adminOnly, memberOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Admin: get all projects
router.get("/all", protect, adminOnly, getProjects);

// 🔹 Admin: CRUD
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

// 🔹 Member + Admin: view assigned projects
router.get("/", protect, getProjectsForMember);

export default router;
