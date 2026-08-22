const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
    trainingCompletion: { type: Number, default: 0, min: 0, max: 100 }, // %
    meetingsAttended: { type: Number, default: 0 },
    totalMeetingsScheduled: { type: Number, default: 0 },
    quizScores: [
      {
        trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "Training" },
        score: Number,
        maxScore: Number,
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    assignmentsSubmitted: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0, min: 0, max: 100 }, // %
    overallScore: { type: Number, default: 0, min: 0, max: 100 }, // weighted composite
    placementReadiness: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
    milestones: [
      {
        title: String,
        achievedAt: Date,
        type: { type: String, enum: ["training", "meeting", "quiz", "certificate"] },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
