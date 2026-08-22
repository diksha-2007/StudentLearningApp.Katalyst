import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CalendarView from "../../components/CalendarView";
import API from "../../api";

export default function StudentMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ mentorId: "", topic: "", scheduledDate: "", scheduledTime: "", duration: 30, agenda: "" });
  const [tab, setTab] = useState("calendar");

  const fetchMeetings = () => {
    API.get("/meetings/student")
      .then((res) => setMeetings(res.data.meetings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchMentors = () => {
    API.get("/mentors")
      .then((res) => setMentors(res.data.mentors || []))
      .catch(console.error);
  };

  useEffect(() => { 
    fetchMeetings();
    fetchMentors();
  }, []);

  const bookMeeting = async (e) => {
    e.preventDefault();
    try {
      await API.post("/meetings", form);
      setShowBook(false);
      setForm({ mentorId: "", topic: "", scheduledDate: "", scheduledTime: "", duration: 30, agenda: "" });
      alert("Meeting requested successfully!");
      fetchMeetings();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const cancelMeeting = async (id) => {
    if (!confirm("Cancel this meeting?")) return;
    await API.delete(`/meetings/${id}`);
    fetchMeetings();
  };

  const submitFeedback = async (id) => {
    const rating = prompt("Rate 1-5:");
    const comment = prompt("Your feedback:");
    if (!rating) return;
    await API.post(`/meetings/${id}/feedback`, { rating: Number(rating), comment });
    fetchMeetings();
  };

  const now = new Date();
  const filtered = meetings.filter((m) => {
    const date = new Date(m.scheduledDate);
    if (tab === "upcoming") return date >= now && !["cancelled", "rejected", "completed"].includes(m.status);
    if (tab === "past") return date < now || ["completed", "cancelled", "rejected"].includes(m.status);
    return true;
  });

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <DashboardLayout
      title="Calendar & Meetings"
      subtitle="Student Portal"
      actions={
        <button onClick={() => setShowBook(true)} className="btn-primary !py-2 text-sm">
          + Book Meeting
        </button>
      }
    >
      <div className="mb-6 flex gap-2">
        {[
          { id: "calendar", label: "📅 Interactive Calendar" },
          { id: "upcoming", label: "⏳ Upcoming Meetings" },
          { id: "past", label: "📋 Meeting History" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-katalyst-500 text-white" : "border"
            }`}
            style={tab !== t.id ? { borderColor: "var(--border)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : tab === "calendar" ? (
        <div className="space-y-6">
          <CalendarView events={meetings} userRole="student" />

          {/* Quick List under Calendar */}
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Scheduled Sessions</h3>
            <div className="space-y-3">
              {meetings.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No meetings scheduled yet.</p>
              ) : (
                meetings.map((m) => (
                  <div key={m._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="font-bold">{m.topic}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        with {m.mentorId?.name || "Mentor"} · {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[m.status] || ""}`}>
                      {m.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl">📅</p>
          <p className="mt-4 font-medium">No {tab} meetings</p>
          <button onClick={() => setShowBook(true)} className="btn-primary mt-4">Book your first meeting</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m._id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{m.topic}</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    with {m.mentorId?.name || "Mentor"} · {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime}
                  </p>
                  {m.agenda && <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{m.agenda}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[m.status] || ""}`}>
                  {m.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.meetLink && m.status === "accepted" && (
                  <a href={m.meetLink} target="_blank" rel="noreferrer" className="btn-primary !py-1.5 text-xs">
                    Join Google Meet
                  </a>
                )}
                {m.status === "pending" && (
                  <button onClick={() => cancelMeeting(m._id)} className="btn-secondary !py-1.5 text-xs">Cancel</button>
                )}
                {m.status === "completed" && !m.studentFeedback?.rating && (
                  <button onClick={() => submitFeedback(m._id)} className="btn-secondary !py-1.5 text-xs">Give Feedback</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold">Book Mentor Meeting</h3>
            <form onSubmit={bookMeeting} className="mt-4 space-y-3">
              {mentors.length > 0 && (
                <select 
                  className="input-field" 
                  value={form.mentorId}
                  onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
                >
                  <option value="">Assigned / Default Mentor</option>
                  {mentors.map((m) => (
                    <option key={m._id} value={m._id}>{m.name} ({m.expertise?.join(", ") || "Mentor"})</option>
                  ))}
                </select>
              )}
              <input className="input-field" placeholder="Topic (e.g. Code Review & Career Guidance)" value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
              <input type="date" className="input-field" value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required />
              <input type="time" className="input-field" value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} required />
              <textarea className="input-field" placeholder="Agenda (optional)" rows={3} value={form.agenda}
                onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowBook(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Book Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
