const express = require("express");
const router = express.Router();
const {
  getScholarships,
  getScholarshipById,
  checkEligibility,
} = require("../controllers/scholarshipController");

router.get("/", getScholarships);
router.get("/:id", getScholarshipById);
router.post("/check-eligibility", checkEligibility);

module.exports = router;
