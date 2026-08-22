const Meeting = require("../models/Meeting");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

// @desc Book a meeting
// @route POST /api/meetings
const bookMeeting = async (req, res) => {
  try {
    const { mentorId, topic, agenda, scheduledDate, scheduledTime, duration, meetLink } = req.body;

    let resolvedMentorId = mentorId;
    if (!resolvedMentorId) {
      const student = await Student.findById(req.user.id);
      resolvedMentorId = student?.assignedMentor;
    }
    if (!resolvedMentorId) {
      // Fallback: pick the first available mentor in the DB
      const fallbackMentor = await Mentor.findOne();
      if (fallbackMentor) {
        resolvedMentorId = fallbackMentor._id;
      }
    }

    if (!resolvedMentorId)
      return res.status(400).json({ message: "No mentor available in platform. Please contact admin." });

    const mentor = await Mentor.findById(resolvedMentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Auto-generate Google Meet link if not provided
    const randomCode = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
    const generatedMeetLink = meetLink || `https://meet.google.com/${randomCode}`;

    const meeting = await Meeting.create({
      studentId: req.user.id,
      mentorId: resolvedMentorId,
      topic,
      agenda,
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      meetLink: generatedMeetLink,
      status: "accepted", // Auto-confirm with meet link
    });

    // Notify mentor with Google Meet link
    await Notification.create({
      userId: resolvedMentorId,
      userRole: "mentor",
      title: "New Meeting Scheduled 📹",
      message: `Meeting on "${topic}" scheduled. Google Meet: ${generatedMeetLink}`,
      type: "meeting",
    });

    // Notify student with Google Meet link
    await Notification.create({
      userId: req.user.id,
      userRole: "student",
      title: "Meeting Confirmed & Google Meet Ready! 📹",
      message: `Your meeting on "${topic}" is set for ${scheduledDate} at ${scheduledTime}. Google Meet Link: ${generatedMeetLink}`,
      type: "meeting",
    });

    res.status(201).json({ message: "Meeting scheduled with Google Meet link!", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get student meetings
// @route GET /api/meetings/student
const getStudentMeetings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { studentId: req.user.id };
    if (status) filter.status = status;

    const meetings = await Meeting.find(filter)
      .populate("mentorId", "name email profilePic designation company")
      .sort({ scheduledDate: -1 });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get mentor meetings
// @route GET /api/meetings/mentor
const getMentorMeetings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { mentorId: req.user.id };
    if (status) filter.status = status;

    const meetings = await Meeting.find(filter)
      .populate("studentId", "name email profilePic phone")
      .sort({ scheduledDate: -1 });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update meeting status
// @route PUT /api/meetings/:id/status
const updateMeetingStatus = async (req, res) => {
  try {
    const { status, rejectionReason, meetLink } = req.body;
    const defaultMeetLink = meetLink || "https://meet.google.com/katalyst-session";

    const updateObj = { status, rejectionReason: rejectionReason || "" };
    if (status === "accepted") {
      updateObj.meetLink = defaultMeetLink;
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    ).populate("mentorId", "name");

    if (meeting) {
      await Notification.create({
        userId: meeting.studentId,
        userRole: "student",
        title: `Meeting ${status === "accepted" ? "Accepted ✅" : status === "rejected" ? "Declined ❌" : "Updated"}`,
        message: `Your meeting "${meeting.topic}" has been ${status}${status === "accepted" ? `. Link: ${defaultMeetLink}` : ""}.`,
        type: "meeting",
      });
    }

    res.json({ message: "Meeting updated", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Submit student feedback for meeting
// @route POST /api/meetings/:id/feedback
const submitStudentFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        "studentFeedback.rating": rating,
        "studentFeedback.comment": comment,
        "studentFeedback.givenAt": new Date(),
      },
      { new: true }
    );

    // Update mentor rating
    const mentor = await Mentor.findById(meeting.mentorId);
    const newTotal = mentor.totalRatings + 1;
    const newRating = ((mentor.rating * mentor.totalRatings) + rating) / newTotal;
    await Mentor.findByIdAndUpdate(meeting.mentorId, {
      rating: Math.round(newRating * 10) / 10,
      totalRatings: newTotal,
    });

    res.json({ message: "Feedback submitted", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Cancel meeting
// @route DELETE /api/meetings/:id
const cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    meeting.status = "cancelled";
    await meeting.save();
    res.json({ message: "Meeting cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all meetings (admin)
// @route GET /api/meetings/admin
const getAllMeetingsAdmin = async (req, res) => {
  try {
    const meetings = await Meeting.find({})
      .populate("studentId", "name email profilePic")
      .populate("mentorId", "name email profilePic designation")
      .sort({ scheduledDate: -1 });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  bookMeeting,
  getStudentMeetings,
  getMentorMeetings,
  getAllMeetingsAdmin,
  updateMeetingStatus,
  submitStudentFeedback,
  cancelMeeting,
};
