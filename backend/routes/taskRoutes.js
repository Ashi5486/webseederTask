import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getTasks,
  getTasksForMember,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Admin: view all tasks
router.get("/", protect, adminOnly, getTasks);

// Member: view only their assigned tasks
router.get("/my-tasks", protect, getMyTasks);

// Admin: CRUD
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask); // Admin or assigned member can update
router.delete("/:id", protect, adminOnly, deleteTask);

export default router;
