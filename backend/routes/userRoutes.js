import express from "express";
import multer from "multer";
import path from "path";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getMe, updateProfile, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// ============= Multer Setup for Avatar Upload =============
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ============= Routes =============

// 🔹 Logged-in user profile
router.get("/me", protect, getMe);

// 🔹 Update profile (with optional avatar upload)
router.put("/update", protect, upload.single("avatar"), updateProfile);

// 🔹 Admin: View all users
router.get("/", protect, adminOnly, getAllUsers);

export default router;
