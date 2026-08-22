const Progress = require("../models/Progress");
const Training = require("../models/Training");
const Student = require("../models/Student");
const { calculateOverallProgress, calculatePlacementReadiness } = require("../utils/progressCalculator");

const getStudentProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ studentId: req.user.id });
    if (!progress) return res.status(404).json({ message: "Progress record not found" });
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDetailedStudentReport = async (req, res) => {
  try {
    const targetStudentId = req.params.studentId || req.user.id;
    const student = await Student.findById(targetStudentId)
      .select("-password")
      .populate("assignedMentor", "name email designation company")
      .populate("enrolledTrainings", "title category level duration lessons");

    if (!student) return res.status(404).json({ message: "Student not found" });

    let progress = await Progress.findOne({ studentId: targetStudentId });
    if (!progress) {
      progress = await Progress.create({ studentId: targetStudentId });
    }

    res.json({
      student,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPlacementReadiness = async (req, res) => {
  try {
    const progress = await Progress.findOne({ studentId: req.user.id });
    if (!progress) return res.status(404).json({ message: "Progress record not found" });

    const placementScore = calculatePlacementReadiness({
      overallScore: progress.overallScore,
      quizScores: progress.quizScores,
      assignmentsSubmitted: progress.assignmentsSubmitted,
      meetingsAttended: progress.meetingsAttended,
      hasResume: progress.hasResume,
    });

    res.json({ placementReadiness: placementScore });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAdminProgressReport = async (req, res) => {
  try {
    const progressData = await Progress.find()
      .populate("studentId", "name email assignedMentor")
      .sort({ overallScore: -1 });

    const averageOverall =
      progressData.length > 0
        ?
          progressData.reduce((sum, p) => sum + p.overallScore, 0) / progressData.length
        : 0;

    const averagePlacement =
      progressData.length > 0
        ?
          progressData.reduce((sum, p) => sum + p.placementReadiness, 0) / progressData.length
        : 0;

    res.json({
      progressData,
      metrics: {
        averageOverall: Math.round(averageOverall),
        averagePlacement: Math.round(averagePlacement),
        totalStudents: progressData.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getStudentProgress,
  getDetailedStudentReport,
  getPlacementReadiness,
  getAdminProgressReport,
};
