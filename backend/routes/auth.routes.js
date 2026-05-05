import express from "express";
import jwt from "jsonwebtoken";
import Student from "../models/student.js";
import Faculty from "../models/faculty.js";
import Admin from "../models/admin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const generateToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "7d" });
};

// Student Login
router.post("/student", async (req, res) => {
  const user = await Student.findOne(req.body);
  if (user) {
    res.json({ token: generateToken(user, "Student"), ...user.toObject() });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Faculty Login
router.post("/faculty", async (req, res) => {
  const user = await Faculty.findOne(req.body);
  if (user) {
    res.json({ token: generateToken(user, "Faculty"), ...user.toObject() });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// 🔥 Admin Login
router.post("/admin", async (req, res) => {
  const user = await Admin.findOne(req.body);
  if (user) {
    res.json({ token: generateToken(user, "Admin"), ...user.toObject() });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// GET /me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { id, role } = req.user;
    let user;

    if (role === "Student") user = await Student.findById(id);
    else if (role === "Faculty") user = await Faculty.findById(id);
    else if (role === "Admin") user = await Admin.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role, ...user.toObject() });
  } catch (error) {
    res.status(500).json({ error: "Server error during session restore" });
  }
});

export default router;