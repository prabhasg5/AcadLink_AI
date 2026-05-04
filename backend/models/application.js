import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: String,
  jobId: String,
  facultyId: String,

  status: {
    type: String,
    default: "applied"
  },

  submittedData: {
    name: String,
    email: String,
    resumeLink: String,
    extraFields: Object
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Application", applicationSchema);