import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Models
import Student from "./models/student.js";
import Faculty from "./models/faculty.js";
import Admin from "./models/admin.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // 🔥 Clear existing data (optional but useful for demo)
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Admin.deleteMany();

    // 👨‍🎓 Students
    const students = [
      {
        name: "Sahith",
        email: "238w1a1266@vrsec.ac.in",
        password: "1234",
        department: "IT",
        rollNumber: "238W1A1266",
        resumeUploaded: false
      },
      {
        name: "Rahul",
        email: "238w1a1255@vrsec.ac.in",
        password: "1234",
        department: "CSE",
        rollNumber: "238W1A1255",
        resumeUploaded: false
      },
      {
        name: "Anjali",
        email: "238w1a1244@vrsec.ac.in",
        password: "1234",
        department: "IT",
        rollNumber: "238W1A1244",
        resumeUploaded: false
      },
      {
        name: "Kiran",
        email: "238w1a1233@vrsec.ac.in",
        password: "1234",
        department: "ECE",
        rollNumber: "238W1A1233",
        resumeUploaded: false
      }
    ];

    // 👨‍🏫 Faculty
    const faculty = [
      {
        name: "Dr. Ashok Kumar",
        email: "ashok@vrsec.ac.in",
        password: "1234",
        department: "IT"
      },
      {
        name: "Dr. Suresh",
        email: "suresh@vrsec.ac.in",
        password: "1234",
        department: "CSE"
      }
    ];

    // 🏢 Admin
    const admin = [
      {
        name: "Admin",
        email: "admin@vrsec.ac.in",
        password: "admin123"
      }
    ];

    await Student.insertMany(students);
    await Faculty.insertMany(faculty);
    await Admin.insertMany(admin);

    console.log("✅ Data Seeded Successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();