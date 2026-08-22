const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  getDashboard,
  getProfile,
  updateProfile,
  uploadResume,
  getCertificates,
  getProgress,
  getMeetings,
} = require("../controllers/studentController");

// Multer setup for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes/"),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase()))
      return cb(new Error("Only PDF/DOC files allowed"));
    cb(null, true);
  },
});

router.use(protect, allowRoles("student"));

router.get("/dashboard", getDashboard);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/resume", upload.single("resume"), uploadResume);
router.get("/certificates", getCertificates);
router.get("/progress", getProgress);
router.get("/meetings", getMeetings);

module.exports = router;
