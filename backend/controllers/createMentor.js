const mongoose = require("mongoose");
const Mentor = require("./models/Mentor");
require("dotenv").config();

async function createMentor() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "sarah@katalyst.io";

    const existing = await Mentor.findOne({ email });

    if (existing) {
      console.log("Mentor already exists:", existing.email);
      await mongoose.disconnect();
      return;
    }

    const mentor = await Mentor.create({
      name: "Sarah Mentor",
      email: "sarah@katalyst.io",
      password: "Mentor@123",
      phone: "9876543210",
      bio: "Experienced Katalyst mentor",
      profilePic: "",
      expertise: ["Web Development", "JavaScript", "React"],
      designation: "Senior Mentor",
      company: "Katalyst",
      role: "mentor",
      isActive: true,
      assignedStudents: [],
      rating: 0,
      totalRatings: 0,
      availability: [],
    });

    console.log("✅ MENTOR CREATED");
    console.log("Email:", mentor.email);
    console.log("Password: Mentor@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  }
}

createMentor();