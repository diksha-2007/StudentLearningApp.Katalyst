const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  bookMeeting,
  getStudentMeetings,
  getMentorMeetings,
  getAllMeetingsAdmin,
  updateMeetingStatus,
  submitStudentFeedback,
  cancelMeeting,
} = require("../controllers/meetingController");

router.use(protect);

router.post("/", allowRoles("student"), bookMeeting);
router.get("/student", allowRoles("student"), getStudentMeetings);
router.get("/mentor", allowRoles("mentor"), getMentorMeetings);
router.get("/admin", allowRoles("admin"), getAllMeetingsAdmin);
router.put("/:id/status", allowRoles("mentor", "admin"), updateMeetingStatus);
router.post("/:id/feedback", allowRoles("student"), submitStudentFeedback);
router.delete("/:id", allowRoles("student", "admin"), cancelMeeting);

module.exports = router;
