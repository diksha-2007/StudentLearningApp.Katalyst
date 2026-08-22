const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    fromId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "fromRole" },
    fromRole: { type: String, enum: ["student", "mentor"], required: true },
    toId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "toRole" },
    toRole: { type: String, enum: ["student", "mentor"], required: true },
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
    trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "Training" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    type: { type: String, enum: ["meeting", "training", "general"], default: "meeting" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
