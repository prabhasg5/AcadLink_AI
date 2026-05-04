import express from "express"; // Trigger restart for Groq
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import studentRoutes from "./routes/student.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import analyseRoutes from "./routes/analyse.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analyse", analyseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));