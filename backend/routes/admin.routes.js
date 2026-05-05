import express from "express";
import Student from "../models/student.js";
import Faculty from "../models/faculty.js";
import Job from "../models/job.js";
import Application from "../models/application.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {

  const totalStudents = await Student.countDocuments();
  const totalFaculty = await Faculty.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  const appsPerJob = await Application.aggregate([
    {
      $group: {
        _id: "$jobId",
        count: { $sum: 1 }
      }
    }
  ]);

  const jobsPerFaculty = await Job.aggregate([
    {
      $group: {
        _id: "$postedBy",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    totalStudents,
    totalFaculty,
    totalJobs,
    totalApplications,
    appsPerJob,
    jobsPerFaculty
  });
});

// GET /jobs - Get all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;