// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

dotenv.config(); 

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://webseedertask.onrender.com"
  ],
  credentials: true,
}));

app.use(express.json());

const _dirname = path.resolve();

// Debug: check that routes load
console.log("✅ Loading /api/auth routes...");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// app.get("/", (req, res) => {
//   res.send("✅ Server is running and connected to MongoDB");
// });

// Serve frontend
app.use(express.static(path.join(_dirname, "frontend/dist")));

// FIX: Express 5 wildcard route must be REGEX
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(_dirname, "frontend/dist/index.html"));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
