const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const generateToken = require("../utils/generateToken");

// =========================================================
// REGISTER STUDENT
// POST /api/auth/register
// =========================================================
// =========================================================
// REGISTER USER (Student, Mentor, or Admin)
// POST /api/auth/register
// =========================================================
const registerStudent = async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", req.body);

    const { name, email, password, phone, role = "student" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();
    const targetRole = ["student", "mentor", "admin"].includes(role) ? role : "student";

    // Check existing across all collections
    const [existingStudent, existingMentor, existingAdmin] = await Promise.all([
      Student.findOne({ email: cleanEmail }),
      Mentor.findOne({ email: cleanEmail }),
      Admin.findOne({ email: cleanEmail }),
    ]);

    if (existingStudent || existingMentor || existingAdmin) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    let newUser;

    if (targetRole === "admin") {
      newUser = await Admin.create({
        name: name.trim(),
        email: cleanEmail,
        password,
      });
    } else if (targetRole === "mentor") {
      newUser = await Mentor.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || "",
        expertise: ["Web Development", "Mentorship"],
        designation: "Senior Mentor",
        company: "Katalyst",
      });
    } else {
      newUser = await Student.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || "",
      });

      // Create progress & welcome notification for student
      try {
        await Progress.create({ studentId: newUser._id });
      } catch (err) {}

      try {
        await Notification.create({
          userId: newUser._id,
          userRole: "student",
          title: "Welcome to Katalyst! 🎉",
          message: "Your account is ready. Start exploring trainings and book your first mentorship session!",
          type: "system",
        });
      } catch (err) {}
    }

    console.log("USER CREATED:", newUser._id, targetRole);

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(newUser._id, targetRole),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: targetRole,
        profilePic: newUser.profilePic || "",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// =========================================================
// LOGIN (With Multi-Role Auto-Provisioning on Valid Password)
// POST /api/auth/login
// =========================================================
const login = async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const targetRole = role || "student";

    // 1. Search across all collections for existing account
    let student = await Student.findOne({ email: cleanEmail });
    let mentor = await Mentor.findOne({ email: cleanEmail });
    let admin = await Admin.findOne({ email: cleanEmail });

    let existingUser = student || mentor || admin;

    // Not found anywhere
    if (!existingUser) {
      return res.status(401).json({
        message: `No account registered with ${cleanEmail}. Please create an account first.`,
      });
    }

    // 2. Check password against existing user
    if (!existingUser.matchPassword) {
      return res.status(500).json({
        message: "Password authentication misconfigured in user model",
      });
    }

    const passwordCorrect = await existingUser.matchPassword(cleanPass);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Incorrect password. Please try again or click Forgot Password.",
      });
    }

    // 3. Password is valid! Provision/Resolve target role profile if needed
    let userToLogin = null;
    let actualRole = targetRole;

    if (targetRole === "admin") {
      if (!admin) {
        admin = await Admin.create({
          name: existingUser.name,
          email: cleanEmail,
          password: cleanPass,
        });
      }
      userToLogin = admin;
      actualRole = "admin";
    } else if (targetRole === "mentor") {
      if (!mentor) {
        mentor = await Mentor.create({
          name: existingUser.name,
          email: cleanEmail,
          password: cleanPass,
          phone: existingUser.phone || "",
          expertise: ["Web Development", "Mentorship"],
          designation: "Senior Mentor",
          company: "Katalyst",
        });
      }
      userToLogin = mentor;
      actualRole = "mentor";
    } else {
      if (!student) {
        student = await Student.create({
          name: existingUser.name,
          email: cleanEmail,
          password: cleanPass,
          phone: existingUser.phone || "",
        });
        try { await Progress.create({ studentId: student._id }); } catch (err) {}
      }
      userToLogin = student;
      actualRole = "student";
    }

    // Check active state
    if (!userToLogin.isActive && actualRole !== "admin") {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // Update student last login
    if (actualRole === "student") {
      userToLogin.lastLogin = new Date();
      await userToLogin.save();
    }

    // Generate JWT with actualRole
    const token = generateToken(userToLogin._id, actualRole);

    console.log("LOGIN SUCCESS:", userToLogin.email, actualRole);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userToLogin._id,
        name: userToLogin.name,
        email: userToLogin.email,
        role: actualRole,
        profilePic: userToLogin.profilePic || "",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// =========================================================
// GET CURRENT USER
// GET /api/auth/me
// =========================================================
const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;

    if (role === "student") {
      user = await Student.findById(id)
        .select("-password")
        .populate(
          "assignedMentor",
          "name email expertise profilePic"
        );
    } else if (role === "mentor") {
      user = await Mentor.findById(id).select("-password");
    } else if (role === "admin") {
      user = await Admin.findById(id).select("-password");
    } else {
      return res.status(400).json({
        message: "Invalid user role",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        ...user.toObject(),
        role,
      },
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// =========================================================
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [student, mentor, admin] = await Promise.all([
      Student.findOne({ email: cleanEmail }),
      Mentor.findOne({ email: cleanEmail }),
      Admin.findOne({ email: cleanEmail }),
    ]);

    const targetUser = student || mentor || admin;

    if (!targetUser) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    targetUser.password = newPassword;
    await targetUser.save();

    return res.json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerStudent,
  login,
  getMe,
  resetPassword,
};