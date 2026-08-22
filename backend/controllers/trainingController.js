const Training = require("../models/Training");
const Certificate = require("../models/Certificate");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const { calculateOverallProgress } = require("../utils/progressCalculator");

// @desc Get all trainings
// @route GET /api/trainings
const getAllTrainings = async (req, res) => {
  try {
    const { category, level } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;

    const trainings = await Training.find(filter).select(
      "title description category thumbnail level duration instructor tags enrolledStudents createdAt"
    );

    const trainingsWithCount = trainings.map((t) => ({
      ...t.toObject(),
      enrollmentCount: t.enrolledStudents.length,
      enrolledStudents: undefined,
    }));

    res.json({ trainings: trainingsWithCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get training details
// @route GET /api/trainings/:id
const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });

    let userEnrollment = null;
    if (req.user) {
      userEnrollment = training.enrolledStudents.find(
        (e) => e.studentId.toString() === req.user.id
      );
    }

    res.json({
      training: {
        ...training.toObject(),
        enrollmentCount: training.enrolledStudents.length,
      },
      userEnrollment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Enroll in training
// @route POST /api/trainings/:id/enroll
const enrollTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });

    const alreadyEnrolled = training.enrolledStudents.find(
      (e) => e.studentId.toString() === req.user.id
    );
    if (alreadyEnrolled)
      return res.status(400).json({ message: "Already enrolled" });

    training.enrolledStudents.push({ studentId: req.user.id });
    await training.save();

    await Notification.create({
      userId: req.user.id,
      userRole: "student",
      title: `Enrolled in ${training.title} 📚`,
      message: `You're now enrolled. Start learning and track your progress!`,
      type: "training",
    });

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Mark video as completed
// @route POST /api/trainings/:id/complete-video
const completeVideo = async (req, res) => {
  try {
    const { videoIndex } = req.body;
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });

    const enrollment = training.enrolledStudents.find(
      (e) => e.studentId.toString() === req.user.id
    );
    if (!enrollment) return res.status(400).json({ message: "Not enrolled" });

    if (!enrollment.completedVideos.includes(videoIndex)) {
      enrollment.completedVideos.push(videoIndex);
    }

    // Check if all videos completed
    const allCompleted =
      training.videos.length > 0 &&
      enrollment.completedVideos.length === training.videos.length;

    if (allCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();

      // Issue certificate
      const cert = await Certificate.create({
        studentId: req.user.id,
        trainingId: training._id,
        trainingTitle: training.title,
      });

      await Notification.create({
        userId: req.user.id,
        userRole: "student",
        title: "Certificate Earned! 🏆",
        message: `Congratulations! You completed "${training.title}" and earned a certificate.`,
        type: "certificate",
      });
    }

    await training.save();

    // Update progress
    const allTrainings = await Training.find({
      "enrolledStudents.studentId": req.user.id,
    });
    const completedCount = allTrainings.filter((t) =>
      t.enrolledStudents.find(
        (e) => e.studentId.toString() === req.user.id && e.isCompleted
      )
    ).length;
    const trainingCompletion =
      allTrainings.length > 0
        ? Math.round((completedCount / allTrainings.length) * 100)
        : 0;

    await Progress.findOneAndUpdate(
      { studentId: req.user.id },
      { trainingCompletion }
    );

    const { syncStudentProgress } = require("../utils/progressService");
    await syncStudentProgress(req.user.id);

    res.json({
      message: allCompleted
        ? "Training completed! Certificate issued."
        : "Video marked complete",
      isCompleted: allCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Submit quiz
// @route POST /api/trainings/:id/submit-quiz
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionIndex, selectedOption }]
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });

    let score = 0;
    const maxScore = training.quizzes.reduce((s, q) => s + (q.points || 10), 0);

    answers.forEach(({ questionIndex, selectedOption }) => {
      const quiz = training.quizzes[questionIndex];
      if (quiz && quiz.correctAnswer === selectedOption) {
        score += quiz.points || 10;
      }
    });

    const enrollment = training.enrolledStudents.find(
      (e) => e.studentId.toString() === req.user.id
    );
    if (enrollment) enrollment.quizScore = score;
    await training.save();

    await Progress.findOneAndUpdate(
      { studentId: req.user.id },
      {
        $push: {
          quizScores: {
            trainingId: training._id,
            score,
            maxScore,
          },
        },
      }
    );

    const { syncStudentProgress } = require("../utils/progressService");
    await syncStudentProgress(req.user.id);

    res.json({ score, maxScore, percentage: Math.round((score / maxScore) * 100) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create training (admin)
// @route POST /api/trainings
const createTraining = async (req, res) => {
  try {
    const training = await Training.create(req.body);
    res.status(201).json({ message: "Training created", training });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update training (admin)
// @route PUT /api/trainings/:id
const updateTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Training updated", training });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete training (admin)
// @route DELETE /api/trainings/:id
const deleteTraining = async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: "Training deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllTrainings,
  getTrainingById,
  enrollTraining,
  completeVideo,
  submitQuiz,
  createTraining,
  updateTraining,
  deleteTraining,
};
