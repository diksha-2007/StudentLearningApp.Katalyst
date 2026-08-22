const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  duration: String,
  order: Number,
});

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  points: { type: Number, default: 10 },
});

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  maxScore: { type: Number, default: 100 },
});

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Web Development", "Data Science", "DSA", "Cloud", "AI/ML", "Soft Skills", "Other"],
      default: "Other",
    },
    thumbnail: { type: String, default: "" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    duration: { type: String, default: "" },
    videos: [videoSchema],
    quizzes: [quizSchema],
    assignments: [assignmentSchema],
    enrolledStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        enrolledAt: { type: Date, default: Date.now },
        completedVideos: [Number],
        quizScore: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    certificateTemplate: { type: String, default: "default" },
    isPublished: { type: Boolean, default: true },
    instructor: { type: String, default: "" },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
