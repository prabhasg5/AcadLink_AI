import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  department: String,
  rollNumber: String,
  skills: [String],
  projects: [String],
  resumeUploaded: { type: Boolean, default: false }
});

export default mongoose.model("Student", studentSchema);