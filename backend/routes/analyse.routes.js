import express from "express";
import Groq from "groq-sdk";
import Student from "../models/student.js";
import Job from "../models/job.js";
import GapReport from "../models/gapReport.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { studentId, jobId } = req.body;

  const student = await Student.findById(studentId);
  const job = await Job.findById(jobId);

  const prompt = `
    Analyze the fit between a student and a job.
    
    Student Skills: ${(student.skills || []).join(", ")}
    Student Projects: ${(student.projects || []).join(", ")}
    
    Job Title: ${job.type} at ${job.company}
    Job Description: ${job.description}
    Required Skills: ${(job.skillsRequired || []).join(", ")}

    Determine:
    1. A matchScore from 0 to 100 based on how well the student's skills match the job requirements.
    2. A list of missingSkills that the job requires but the student lacks.
    3. A list of suggestions for the student to improve their chances.

    Return ONLY a JSON object in this format (no markdown, no extra text):
    {
      "matchScore": 85,
      "missingSkills": ["skill1", "skill2"],
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  `;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });

    let analysis;
    try {
      const responseText = response.choices[0]?.message?.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
      analysis = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Groq response");
      return res.status(500).json({ error: "Failed to parse analysis from AI" });
    }

    const report = await GapReport.create({
      studentId,
      jobId,
      matchScore: analysis.matchScore,
      missingSkills: analysis.missingSkills || [],
      suggestions: analysis.suggestions || []
    });

    res.json(report);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Server error during analysis" });
  }
});

export default router;