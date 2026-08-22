/**
 * Calculate overall progress score (weighted composite)
 * Weights: Training 40%, Meetings 30%, Quiz 20%, Attendance 10%
 */
const calculateOverallProgress = ({
  trainingCompletion = 0,
  meetingsAttended = 0,
  totalMeetingsScheduled = 0,
  quizScores = [],
  attendanceRate = 0,
}) => {
  const meetingRate =
    totalMeetingsScheduled > 0
      ? (meetingsAttended / totalMeetingsScheduled) * 100
      : 0;

  const avgQuizScore =
    quizScores.length > 0
      ? quizScores.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0) /
        quizScores.length
      : 0;

  const overall =
    trainingCompletion * 0.4 +
    meetingRate * 0.3 +
    avgQuizScore * 0.2 +
    attendanceRate * 0.1;

  return Math.round(Math.min(overall, 100));
};

/**
 * Calculate placement readiness score
 */
const calculatePlacementReadiness = ({
  overallScore = 0,
  quizScores = [],
  assignmentsSubmitted = 0,
  meetingsAttended = 0,
  hasResume = false,
}) => {
  const quizAvg =
    quizScores.length > 0
      ? quizScores.reduce((s, q) => s + (q.score / q.maxScore) * 100, 0) /
        quizScores.length
      : 0;

  const resumeBonus = hasResume ? 10 : 0;
  const meetingBonus = Math.min(meetingsAttended * 5, 20);
  const assignmentBonus = Math.min(assignmentsSubmitted * 5, 15);

  const score =
    overallScore * 0.4 + quizAvg * 0.3 + resumeBonus + meetingBonus + assignmentBonus;

  return Math.round(Math.min(score, 100));
};

module.exports = { calculateOverallProgress, calculatePlacementReadiness };
