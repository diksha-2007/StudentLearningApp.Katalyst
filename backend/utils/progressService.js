const Progress = require("../models/Progress");
const Training = require("../models/Training");
const { calculateOverallProgress, calculatePlacementReadiness } = require("./progressCalculator");

const syncStudentProgress = async (studentId) => {
  const progress =
    (await Progress.findOne({ studentId })) ||
    new Progress({ studentId, trainingCompletion: 0, meetingsAttended: 0, totalMeetingsScheduled: 0, attendanceRate: 0, overallScore: 0, placementReadiness: 0, hasResume: false });

  const trainings = await Training.find({ "enrolledStudents.studentId": studentId });
  const completedCount = trainings.filter((training) => {
    const enrollment = training.enrolledStudents.find(
      (item) => item.studentId.toString() === studentId.toString()
    );
    return enrollment?.isCompleted;
  }).length;

  progress.trainingCompletion = trainings.length
    ? Math.round((completedCount / trainings.length) * 100)
    : 0;

  // Calculate attendanceRate based on meetings
  const meetingRate = progress.totalMeetingsScheduled > 0
    ? Math.round((progress.meetingsAttended / progress.totalMeetingsScheduled) * 100)
    : 100; // default to 100 if no meetings are scheduled yet
  progress.attendanceRate = Math.min(meetingRate, 100);

  progress.overallScore = calculateOverallProgress(progress.toObject());
  progress.placementReadiness = calculatePlacementReadiness({
    overallScore: progress.overallScore,
    quizScores: progress.quizScores,
    assignmentsSubmitted: progress.assignmentsSubmitted,
    meetingsAttended: progress.meetingsAttended,
    hasResume: progress.hasResume,
  });
  progress.lastUpdated = new Date();

  return progress.save();
};

module.exports = { syncStudentProgress };
