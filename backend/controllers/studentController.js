const Student = require("../models/Student");
const Meeting = require("../models/Meeting");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const Notification = require("../models/Notification");
const Training = require("../models/Training");
const path = require("path");

// @desc Get student dashboard data
// @route GET /api/students/dashboard
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("assignedMentor", "name email expertise profilePic designation company");

    const progress = await Progress.findOne({ studentId: req.user.id });

    const upcomingMeetings = await Meeting.find({
      studentId: req.user.id,
      status: "accepted",
      scheduledDate: { $gte: new Date() },
    })
      .populate("mentorId", "name profilePic designation")
      .sort({ scheduledDate: 1 })
      .limit(3);

    const enrolledTrainings = await Training.find({
      "enrolledStudents.studentId": req.user.id,
    }).select("title category thumbnail enrolledStudents");

    const notifications = await Notification.find({
      userId: req.user.id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const certificates = await Certificate.find({ studentId: req.user.id });

    res.json({
      student,
      progress,
      upcomingMeetings,
      enrolledTrainings: enrolledTrainings.map((t) => {
        const enrollment = t.enrolledStudents.find(
          (e) => e.studentId.toString() === req.user.id
        );
        return {
          _id: t._id,
          title: t.title,
          category: t.category,
          thumbnail: t.thumbnail,
          isCompleted: enrollment?.isCompleted || false,
          completedVideos: enrollment?.completedVideos?.length || 0,
          quizScore: enrollment?.quizScore || 0,
        };
      }),
      unreadNotifications: notifications.length,
      certificates: certificates.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get/Update student profile
// @route GET|PUT /api/students/profile
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("assignedMentor", "name email profilePic designation company");
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, skills } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills
          ? skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated", student: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Upload resume
// @route POST /api/students/resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    await Student.findByIdAndUpdate(req.user.id, { resumeUrl });

    // Mark as having resume in Progress and sync
    await Progress.findOneAndUpdate(
      { studentId: req.user.id },
      { hasResume: true }
    );
    const { syncStudentProgress } = require("../utils/progressService");
    await syncStudentProgress(req.user.id);

    res.json({ message: "Resume uploaded", resumeUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get student certificates
// @route GET /api/students/certificates
const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ studentId: req.user.id }).populate(
      "trainingId",
      "title category"
    );
    res.json({ certificates: certs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get student progress
// @route GET /api/students/progress
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ studentId: req.user.id }).populate(
      "quizScores.trainingId",
      "title"
    );
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all meetings for student
// @route GET /api/students/meetings
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ studentId: req.user.id })
      .populate("mentorId", "name profilePic email designation")
      .sort({ scheduledDate: -1 });
    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  uploadResume,
  getCertificates,
  getProgress,
  getMeetings,
};
