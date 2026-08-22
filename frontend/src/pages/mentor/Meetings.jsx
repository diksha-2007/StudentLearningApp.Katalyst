import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CalendarView from "../../components/CalendarView";
import API from "../../api";

export default function MentorMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesModal, setNotesModal] = useState(null);
  const [notes, setNotes] = useState("");
  const [tab, setTab] = useState("calendar");

  const fetchMeetings = () => {
    API.get("/meetings/mentor")
      .then((res) => setMeetings(res.data.meetings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMeetings(); }, []);

  const respond = async (id, status) => {
    await API.put(`/meetings/${id}/status`, { status });
    fetchMeetings();
  };

  const addNotes = async () => {
    await API.put(`/meetings/${notesModal}/status`, { mentorNotes: notes });
    setNotesModal(null);
    setNotes("");
    fetchMeetings();
  };

  const completeMeeting = async (id) => {
    await API.put(`/meetings/${id}/status`, { status: "completed" });
    fetchMeetings();
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <DashboardLayout title="Calendar & Meetings" subtitle="Mentor Portal">
      <div className="mb-6 flex gap-2">
        {[
          { id: "calendar", label: "📅 Interactive Calendar" },
          { id: "requests", label: "📬 Meeting Requests" },
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
          <CalendarView events={meetings} userRole="mentor" />

          {/* Quick List */}
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Scheduled Mentorship Sessions</h3>
            <div className="space-y-3">
              {meetings.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No sessions scheduled.</p>
              ) : (
                meetings.map((m) => (
                  <div key={m._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="font-bold">{m.topic}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Student: {m.studentId?.name || "Student"} · {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime}
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
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <div key={m._id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{m.topic}</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Student: {m.studentId?.name} ({m.studentId?.email}) · {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime}
                  </p>
                  {m.agenda && <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Agenda: {m.agenda}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.status === "pending" && (
                  <>
                    <button onClick={() => respond(m._id, "accepted")} className="btn-primary !py-1.5 text-xs">Accept Request</button>
                    <button onClick={() => respond(m._id, "rejected")} className="btn-secondary !py-1.5 text-xs text-red-500">Decline</button>
                  </>
                )}
                {m.status === "accepted" && (
                  <>
                    {m.meetLink && (
                      <a href={m.meetLink} target="_blank" rel="noreferrer" className="btn-primary !py-1.5 text-xs">Join Google Meet</a>
                    )}
                    <button onClick={() => setNotesModal(m._id)} className="btn-secondary !py-1.5 text-xs">Add Notes</button>
                    <button onClick={() => completeMeeting(m._id)} className="btn-secondary !py-1.5 text-xs">Mark Completed</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card w-full max-w-md p-6">
            <h3 className="font-bold">Meeting Notes</h3>
            <textarea className="input-field mt-3" rows={4} value={notes}
              onChange={(e) => setNotes(e.target.value)} placeholder="Add meeting notes..." />
            <div className="mt-3 flex gap-2">
              <button onClick={() => setNotesModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={addNotes} className="btn-primary flex-1">Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
