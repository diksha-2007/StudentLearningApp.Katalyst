const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Meeting = require("../models/Meeting");
const Progress = require("../models/Progress");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");
const { sendEmail, meetingAcceptedEmail, meetingRejectedEmail } = require("../utils/sendEmail");

// @desc Get mentor dashboard
// @route GET /api/mentors/dashboard
const getDashboard = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user.id)
      .select("-password")
      .populate("assignedStudents", "name email profilePic lastLogin");

    const pendingMeetings = await Meeting.find({
      mentorId: req.user.id,
      status: "pending",
    })
      .populate("studentId", "name email profilePic")
      .sort({ createdAt: -1 });

    const upcomingMeetings = await Meeting.find({
      mentorId: req.user.id,
      status: "accepted",
      scheduledDate: { $gte: new Date() },
    })
      .populate("studentId", "name email profilePic")
      .sort({ scheduledDate: 1 })
      .limit(5);

    const completedMeetings = await Meeting.countDocuments({
      mentorId: req.user.id,
      status: "completed",
    });

    res.json({
      mentor,
      pendingMeetings,
      upcomingMeetings,
      stats: {
        totalStudents: mentor.assignedStudents.length,
        pendingRequests: pendingMeetings.length,
        completedMeetings,
        rating: mentor.rating,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get assigned students with progress
// @route GET /api/mentors/students
const getStudents = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user.id).populate(
      "assignedStudents",
      "name email profilePic phone skills bio lastLogin"
    );

    const studentsWithProgress = await Promise.all(
      mentor.assignedStudents.map(async (student) => {
        const progress = await Progress.findOne({ studentId: student._id });
        return { ...student.toObject(), progress };
      })
    );

    res.json({ students: studentsWithProgress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Accept or reject meeting
// @route PUT /api/mentors/meeting/:id
const respondToMeeting = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const meeting = await Meeting.findById(req.params.id).populate(
      "studentId",
      "name email"
    );

    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    if (meeting.mentorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    meeting.status = status;
    if (status === "rejected") meeting.rejectionReason = rejectionReason || "";
    if (status === "accepted") {
      meeting.meetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}`;
    }
    await meeting.save();

    if (status === "accepted") {
      await Progress.findOneAndUpdate(
        { studentId: meeting.studentId._id },
        { $inc: { totalMeetingsScheduled: 1 } },
        { upsert: true, new: true }
      );
      const { syncStudentProgress } = require("../utils/progressService");
      await syncStudentProgress(meeting.studentId._id);
    }

    const mentor = await Mentor.findById(req.user.id).select("name");

    // Notify student
    await Notification.create({
      userId: meeting.studentId._id,
      userRole: "student",
      title: status === "accepted" ? "Meeting Accepted! ✅" : "Meeting Update",
      message:
        status === "accepted"
          ? `${mentor.name} accepted your meeting request. Check your schedule!`
          : `Your meeting request was not accepted. Reason: ${rejectionReason || "Not specified"}`,
      type: "meeting",
    });

    // Send email
    if (status === "accepted") {
      await sendEmail({
        to: meeting.studentId.email,
        subject: "Katalyst - Meeting Confirmed!",
        html: meetingAcceptedEmail(
          meeting.studentId.name,
          mentor.name,
          new Date(meeting.scheduledDate).toDateString(),
          meeting.scheduledTime,
          meeting.meetLink
        ),
      });
    } else if (status === "rejected") {
      await sendEmail({
        to: meeting.studentId.email,
        subject: "Katalyst - Meeting Update",
        html: meetingRejectedEmail(meeting.studentId.name, mentor.name, rejectionReason),
      });
    }

    res.json({ message: `Meeting ${status}`, meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Add meeting notes
// @route POST /api/mentors/meeting/:id/notes
const addMeetingNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    meeting.notes = notes;
    meeting.status = "completed";
    await meeting.save();

    // Update attendance
    await Progress.findOneAndUpdate(
      { studentId: meeting.studentId },
      { $inc: { meetingsAttended: 1 } }
    );

    const { syncStudentProgress } = require("../utils/progressService");
    await syncStudentProgress(meeting.studentId);

    res.json({ message: "Notes added and meeting marked complete", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Give feedback/rating to student
// @route POST /api/mentors/feedback
const giveFeedback = async (req, res) => {
  try {
    const { studentId, meetingId, rating, comment } = req.body;

    const feedback = await Feedback.create({
      fromId: req.user.id,
      fromRole: "mentor",
      toId: studentId,
      toRole: "student",
      meetingId,
      rating,
      comment,
      type: "meeting",
    });

    // Save mentor feedback on meeting
    await Meeting.findByIdAndUpdate(meetingId, {
      "mentorFeedback.rating": rating,
      "mentorFeedback.comment": comment,
      "mentorFeedback.givenAt": new Date(),
    });

    await Notification.create({
      userId: studentId,
      userRole: "student",
      title: "New Feedback Received ⭐",
      message: `Your mentor has given you a ${rating}/5 rating. Check your feedback section.`,
      type: "feedback",
    });

    const { syncStudentProgress } = require("../utils/progressService");
    await syncStudentProgress(studentId);

    res.json({ message: "Feedback submitted", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all meetings for mentor
// @route GET /api/mentors/meetings
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ mentorId: req.user.id })
      .populate("studentId", "name email profilePic")
      .sort({ scheduledDate: -1 });
    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboard,
  getStudents,
  respondToMeeting,
  addMeetingNotes,
  giveFeedback,
  getMeetings,
};
