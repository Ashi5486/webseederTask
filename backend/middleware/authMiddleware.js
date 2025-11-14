import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware: Verify JWT and attach user
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Token failed or expired" });
  }
};

// ✅ Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

// ✅ Member-only middleware
export const memberOnly = (req, res, next) => {
  if (req.user && req.user.role === "member") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Members only" });
  }
};
