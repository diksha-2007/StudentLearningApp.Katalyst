const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  getStudentProgress,
  getPlacementReadiness,
  getAdminProgressReport,
} = require("../controllers/progressController");

router.use(protect);

router.get("/", allowRoles("student"), getStudentProgress);
router.get("/placement", allowRoles("student"), getPlacementReadiness);
router.get("/admin", allowRoles("admin"), getAdminProgressReport);

module.exports = router;
