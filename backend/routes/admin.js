const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
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
} = require("../controllers/adminController");

router.use(protect, allowRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/students", getAllStudents);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.get("/mentors", getAllMentors);
router.post("/mentors", createMentor);
router.delete("/mentors/:id", deleteMentor);
router.post("/assign-mentor", assignMentor);
router.get("/reports", getReports);
router.post("/notify", sendBulkNotification);

module.exports = router;
