import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import Groq from "groq-sdk";
import Job from "../models/job.js";
import Student from "../models/student.js";
import Watchlist from "../models/watchlist.js";
import Application from "../models/application.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get jobs by department
router.get("/jobs/:studentId", async (req, res) => {
  const student = await Student.findById(req.params.studentId);

  const jobs = await Job.find({
    departmentsEligible: student.department
  });

  res.json(jobs);
});

// Get student's applied job IDs
router.get("/applications/:studentId", async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.params.studentId });
    const appliedJobIds = applications.map(app => app.jobId);
    res.json(appliedJobIds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applied jobs" });
  }
});

// Add to watchlist
router.post("/watchlist", async (req, res) => {
  const data = await Watchlist.create(req.body);
  res.json(data);
});

// Apply
router.post("/apply", async (req, res) => {
  const { studentId, jobId, formData } = req.body;

  const student = await Student.findById(studentId);

  const application = await Application.create({
    studentId,
    jobId,
    submittedData: {
      name: student.name,
      email: student.email,
      resumeLink: student.resumeUploaded ? "resume_link" : "",
      extraFields: formData
    }
  });

  res.json(application);
});

// Upload and parse resume
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No resume file provided" });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      Extract the technical skills and projects from the following resume text.
      Return ONLY a JSON object in this format (no markdown, no extra text):
      {
        "skills": ["skill1", "skill2"],
        "projects": ["Project Name 1", "Project Name 2"]
      }

      Resume Text:
      ${text}
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });

    let extracted;
    try {
      const responseText = response.choices[0]?.message?.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
      extracted = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Groq response");
      extracted = { skills: [], projects: [] };
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        resumeUploaded: true,
        skills: extracted.skills || [],
        projects: extracted.projects || [],
      },
      { new: true }
    );

    res.json(student);
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;