const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Training = require("../models/Training");
const Meeting = require("../models/Meeting");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const Notification = require("../models/Notification");

// @desc Admin dashboard analytics
// @route GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      totalMentors,
      totalTrainings,
      totalMeetings,
      completedMeetings,
      pendingMeetings,
      totalCertificates,
    ] = await Promise.all([
      Student.countDocuments(),
      Mentor.countDocuments(),
      Training.countDocuments(),
      Meeting.countDocuments(),
      Meeting.countDocuments({ status: "completed" }),
      Meeting.countDocuments({ status: "pending" }),
      Certificate.countDocuments(),
    ]);

    // Monthly student registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyStudents = await Student.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Training enrollment stats
    const trainingStats = await Training.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          enrollments: { $size: "$enrolledStudents" },
        },
      },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      stats: {
        totalStudents,
        totalMentors,
        totalTrainings,
        totalMeetings,
        completedMeetings,
        pendingMeetings,
        totalCertificates,
      },
      monthlyStudents,
      topTrainings: trainingStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all students
// @route GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("assignedMentor", "name email")
      .sort({ createdAt: -1 });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Toggle student active status
// @route PUT /api/admin/students/:id
const updateStudent = async (req, res) => {
  try {
    const { isActive } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");
    res.json({ message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete student
// @route DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Progress.deleteOne({ studentId: req.params.id });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all mentors
// @route GET /api/admin/mentors
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password").sort({ createdAt: -1 });
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create mentor (admin only)
// @route POST /api/admin/mentors
const createMentor = async (req, res) => {
  try {
    const { name, email, password, expertise, designation, company, bio } = req.body;
    const exists = await Mentor.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const mentor = await Mentor.create({
      name, email, password,
      expertise: expertise ? expertise.split(",").map((s) => s.trim()) : [],
      designation, company, bio,
    });
    res.status(201).json({ message: "Mentor created", mentor: { ...mentor.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete mentor
// @route DELETE /api/admin/mentors/:id
const deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: "Mentor deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Assign mentor to student
// @route POST /api/admin/assign-mentor
const assignMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { assignedMentor: mentorId },
      { new: true }
    ).select("-password");

    await Mentor.findByIdAndUpdate(mentorId, {
      $addToSet: { assignedStudents: studentId },
    });

    const mentor = await Mentor.findById(mentorId);

    // Notify student
    await Notification.create({
      userId: studentId,
      userRole: "student",
      title: "Mentor Assigned! 🎓",
      message: `${mentor.name} has been assigned as your mentor. Say hello!`,
      type: "system",
    });

    res.json({ message: "Mentor assigned successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get reports
// @route GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const progressData = await Progress.find()
      .populate("studentId", "name email")
      .sort({ overallScore: -1 });

    const meetingReport = await Meeting.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const categoryEnrollment = await Training.aggregate([
      {
        $group: {
          _id: "$category",
          totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    res.json({ progressData, meetingReport, categoryEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Send notification to all users of a role
// @route POST /api/admin/notify
const sendBulkNotification = async (req, res) => {
  try {
    const { title, message, userRole } = req.body;
    let users = [];
    if (userRole === "student") users = await Student.find().select("_id");
    else if (userRole === "mentor") users = await Mentor.find().select("_id");
    else {
      const students = await Student.find().select("_id");
      const mentors = await Mentor.find().select("_id");
      users = [...students, ...mentors];
    }

    const notifications = users.map((u) => ({
      userId: u._id,
      userRole: userRole === "all" ? "student" : userRole,
      title,
      message,
      type: "system",
    }));

    await Notification.insertMany(notifications);
    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getAllMentors,
  createMentor,
  deleteMentor,
  assignMentor,
  getReports,
  sendBulkNotification,
};
