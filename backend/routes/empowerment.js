const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/empowermentController");

// Public / Student
router.get("/", getAllResources);
router.get("/:id", getResourceById);

// Admin Only
router.post("/", protect, allowRoles("admin"), createResource);
router.put("/:id", protect, allowRoles("admin"), updateResource);
router.delete("/:id", protect, allowRoles("admin"), deleteResource);

module.exports = router;
