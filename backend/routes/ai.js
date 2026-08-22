const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  analyzeResume,
  careerRoadmap,
  scholarshipRecommendations,
  assistantChat,
} = require("../controllers/aiController");

router.use(protect);

router.post("/chatbot", assistantChat);

router.use(allowRoles("student"));

router.post("/resume-analyze", analyzeResume);
router.post("/career-roadmap", careerRoadmap);
router.post("/scholarships", scholarshipRecommendations);

module.exports = router;
