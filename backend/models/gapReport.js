import mongoose from "mongoose";

const gapSchema = new mongoose.Schema({
  studentId: String,
  jobId: String,
  matchScore: Number,
  missingSkills: [String],
  suggestions: [String]
});

export default mongoose.model("GapReport", gapSchema);