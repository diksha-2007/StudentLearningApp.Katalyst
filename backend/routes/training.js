const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  getAllTrainings,
  getTrainingById,
  enrollTraining,
  completeVideo,
  submitQuiz,
  createTraining,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingController");

// Public
router.get("/", getAllTrainings);
router.get("/:id", protect, getTrainingById);

// Student
router.post("/:id/enroll", protect, allowRoles("student"), enrollTraining);
router.post("/:id/complete-video", protect, allowRoles("student"), completeVideo);
router.post("/:id/submit-quiz", protect, allowRoles("student"), submitQuiz);

// Admin
router.post("/", protect, allowRoles("admin"), createTraining);
router.put("/:id", protect, allowRoles("admin"), updateTraining);
router.delete("/:id", protect, allowRoles("admin"), deleteTraining);

module.exports = router;
