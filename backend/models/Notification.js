const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userRole: { type: String, enum: ["student", "mentor", "admin"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["meeting", "training", "feedback", "system", "certificate", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
    icon: { type: String, default: "bell" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
