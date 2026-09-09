const mongoose = require("mongoose");

const empowermentResourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["scheme", "scholarship", "exam", "roadmap", "form_guide", "opportunity", "digital_skill"],
      required: true,
    },
    titleEn: { type: String, required: true },
    titleMr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    descriptionMr: { type: String, required: true },
    category: { type: String, default: "General" },
    badge: { type: String, default: "Government Scheme" },
    icon: { type: String, default: "🏛️" },
    eligibilityEn: [String],
    eligibilityMr: [String],
    documentsRequiredEn: [String],
    documentsRequiredMr: [String],
    applicationStepsEn: [String],
    applicationStepsMr: [String],
    benefitsEn: { type: String, default: "" },
    benefitsMr: { type: String, default: "" },
    officialUrl: { type: String, default: "" },
    portalName: { type: String, default: "MahaDBT / National Portal" },
    deadline: { type: String, default: "Ongoing / Annual" },
    district: { type: String, default: "All Districts" },
    targetAudience: { type: String, default: "10th / 12th / Diploma / Degree Students" },
    downloadableGuideUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmpowermentResource", empowermentResourceSchema);
