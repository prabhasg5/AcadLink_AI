import express from "express";
import Student from "../models/student.js";
import Faculty from "../models/faculty.js";
import Admin from "../models/admin.js"; // 🔥 add this

const router = express.Router();

// Student Login
router.post("/student", async (req, res) => {
  const user = await Student.findOne(req.body);
  user ? res.json(user) : res.status(401).send("Invalid credentials");
});

// Faculty Login
router.post("/faculty", async (req, res) => {
  const user = await Faculty.findOne(req.body);
  user ? res.json(user) : res.status(401).send("Invalid credentials");
});

// 🔥 Admin Login
router.post("/admin", async (req, res) => {
  const user = await Admin.findOne(req.body);
  user ? res.json(user) : res.status(401).send("Invalid credentials");
});

export default router;