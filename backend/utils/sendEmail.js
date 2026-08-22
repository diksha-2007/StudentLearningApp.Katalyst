const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Katalyst Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✉️  Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const meetingAcceptedEmail = (studentName, mentorName, date, time, meetLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0;">Katalyst</h1>
    </div>
    <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2>Meeting Confirmed! 🎉</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your meeting with <strong>${mentorName}</strong> has been accepted.</p>
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <p><strong>📅 Date:</strong> ${date}</p>
        <p><strong>⏰ Time:</strong> ${time}</p>
        <p><strong>🔗 Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Best of luck with your mentorship session!</p>
    </div>
  </div>
`;

const meetingRejectedEmail = (studentName, mentorName, reason) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0;">Katalyst</h1>
    </div>
    <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2>Meeting Update</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your meeting request with <strong>${mentorName}</strong> was not accepted at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>Please book another slot or contact the admin for assistance.</p>
    </div>
  </div>
`;

module.exports = { sendEmail, meetingAcceptedEmail, meetingRejectedEmail };
