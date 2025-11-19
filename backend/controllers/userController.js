import User from "../models/User.js";
import path from "path";
import fs from "fs";

// ✅ Get logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update profile (with avatar upload)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      // Remove old avatar if exists
      if (user.avatar && fs.existsSync(path.join("uploads", user.avatar))) {
        fs.unlinkSync(path.join("uploads", user.avatar));
      }
      user.avatar = req.file.filename; // store file name instead of full path
    }

    // Optionally allow updating other fields (like name, email)
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: Get all users (for dashboard)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
