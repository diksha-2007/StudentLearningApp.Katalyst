const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  getDashboard,
  getProfile,
  updateProfile,
  getStudents,
  respondToMeeting,
  addMeetingNotes,
  giveFeedback,
  getMeetings,
} = require("../controllers/mentorController");

router.use(protect, allowRoles("mentor"));

router.get("/dashboard", getDashboard);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/students", getStudents);
router.get("/meetings", getMeetings);
router.put("/meeting/:id", respondToMeeting);
router.post("/meeting/:id/notes", addMeetingNotes);
router.post("/feedback", giveFeedback);

module.exports = router;
