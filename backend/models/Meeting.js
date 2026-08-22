const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    topic: { type: String, required: true },
    agenda: { type: String, default: "" },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    duration: { type: Number, default: 60 }, // minutes
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    meetLink: { type: String, default: "" },
    notes: { type: String, default: "" },
    studentFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      givenAt: Date,
    },
    mentorFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      givenAt: Date,
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
