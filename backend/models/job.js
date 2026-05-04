import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: String,
  type: String,
  description: String,
  packageOrStipend: String,

  departmentsEligible: [String],
  skillsRequired: [String],

  postedBy: String,

  applicationType: {
    type: String,
    enum: ["external", "internal"]
  },

  applicationLink: String,

  formFields: [
    {
      fieldName: String,
      fieldType: String,
      required: Boolean
    }
  ],

  resources: [
    {
      title: String,
      link: String
    }
  ],

  examDetails: {
    date: Date,
    pattern: String
  }
});

export default mongoose.model("Job", jobSchema);