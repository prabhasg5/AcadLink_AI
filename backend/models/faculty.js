import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  department: String
});

export default mongoose.model("Faculty", facultySchema);