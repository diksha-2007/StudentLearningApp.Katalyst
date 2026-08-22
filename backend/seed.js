const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Student = require("./models/Student");
const Mentor = require("./models/Mentor");
const Admin = require("./models/Admin");
const Training = require("./models/Training");
const Progress = require("./models/Progress");
const Notification = require("./models/Notification");
const Certificate = require("./models/Certificate");

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([
      Student.deleteMany(),
      Mentor.deleteMany(),
      Admin.deleteMany(),
      Training.deleteMany(),
      Progress.deleteMany(),
      Notification.deleteMany(),
      Certificate.deleteMany(),
    ]);

    const admin = await Admin.create({
      name: "System Admin",
      email: "admin@katalyst.io",
      password: "Admin@123",
    });

    const mentor1 = await Mentor.create({
      name: "Dr. Sarah Jenkins",
      email: "sarah@katalyst.io",
      password: "Mentor@123",
      expertise: ["Web Development", "React", "Career Coaching"],
      designation: "Senior Mentor",
      company: "Katalyst Labs",
      bio: "Guiding students to build scalable web apps and strong career roadmaps.",
    });

    const student1 = await Student.create({
      name: "Diksha Sharma",
      email: "diksha@katalyst.io",
      password: "Student@123",
      phone: "1234567890",
      bio: "Full Stack student learning modern web development.",
      skills: ["HTML", "CSS", "JavaScript"],
      assignedMentor: mentor1._id,
    });

    const training1 = await Training.create({
      title: "Web Development Masterclass",
      description: "Learn HTML, CSS, JavaScript and React in a project-based path.",
      category: "Web Development",
      level: "Beginner",
      duration: "6 weeks",
      thumbnail: "https://i.imgur.com/Ua7I9qH.png",
      instructor: "Katalyst Mentors",
      tags: ["web", "frontend", "react"],
      videos: [
        { title: "HTML Basics", url: "https://youtu.be/example", duration: "12m", order: 1 },
        { title: "CSS Essentials", url: "https://youtu.be/example", duration: "20m", order: 2 },
        { title: "JavaScript Fundamentals", url: "https://youtu.be/example", duration: "25m", order: 3 },
        { title: "React UI Components", url: "https://youtu.be/example", duration: "30m", order: 4 },
      ],
      quizzes: [
        { question: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], correctAnswer: 0 },
      ],
      assignments: [
        { title: "Build Portfolio Homepage", description: "Create a responsive portfolio landing page.", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [{ studentId: student1._id }],
    });

    await Progress.create({
      studentId: student1._id,
      trainingCompletion: 25,
      meetingsAttended: 1,
      totalMeetingsScheduled: 2,
      quizScores: [{ trainingId: training1._id, score: 8, maxScore: 10 }],
      assignmentsSubmitted: 1,
      attendanceRate: 80,
      overallScore: 66,
      placementReadiness: 60,
      hasResume: false,
    });

    await Notification.create({
      userId: student1._id,
      userRole: "student",
      title: "Welcome to Katalyst!",
      message: "Your student dashboard is ready. Start your first training now.",
      type: "system",
    });

    await Certificate.create({
      studentId: student1._id,
      trainingId: training1._id,
      studentName: student1.name,
      trainingTitle: training1.title,
    });

    console.log("✅ Seed data created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();
