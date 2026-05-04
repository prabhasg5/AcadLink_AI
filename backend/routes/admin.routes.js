import express from "express";
import Student from "../models/student.js";
import Job from "../models/job.js";
import Application from "../models/application.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {

  const totalStudents = await Student.countDocuments();
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
    totalJobs,
    totalApplications,
    appsPerJob,
    jobsPerFaculty
  });
});

export default router;