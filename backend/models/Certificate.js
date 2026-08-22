const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const certificateSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "Training", required: true },
    studentName: String,
    trainingTitle: String,
    issuedDate: { type: Date, default: Date.now },
    certificateUrl: { type: String, default: "" },
    uniqueId: { type: String, default: () => uuidv4().slice(0, 12).toUpperCase() },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
