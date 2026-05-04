import express from "express";
import Job from "../models/job.js";
import Application from "../models/application.js";

const router = express.Router();

// Add Job
router.post("/add-job", async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
});

// Update Job
router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// Get jobs by faculty
router.get("/jobs/:facultyName", async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.facultyName }).sort({ _id: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get applications for a specific job
router.get("/jobs/:jobId/applications", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId }).sort({ _id: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Faculty Analytics
router.get("/analytics/:facultyId", async (req, res) => {
  const jobs = await Job.find({ postedBy: req.params.facultyId });

  const jobIds = jobs.map(j => j._id);

  const applications = await Application.aggregate([
    { $match: { jobId: { $in: jobIds } } },
    {
      $group: {
        _id: "$jobId",
        totalApplications: { $sum: 1 }
      }
    }
  ]);

  res.json({
    totalJobs: jobs.length,
    applications
  });
});

export default router;