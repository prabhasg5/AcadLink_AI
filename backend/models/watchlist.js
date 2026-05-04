import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
  studentId: String,
  jobId: String
});

export default mongoose.model("Watchlist", watchSchema);