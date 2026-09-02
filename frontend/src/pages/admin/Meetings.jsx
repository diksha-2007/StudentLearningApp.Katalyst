import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CalendarView from "../../components/CalendarView";
import API from "../../api";
import { openGoogleMeet } from "../../utils/meetUtils";

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("calendar");

  const fetchMeetings = () => {
    API.get("/meetings/admin")
      .then((res) => setMeetings(res.data.meetings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/meetings/${id}/status`, { status });
    fetchMeetings();
  };

  const statusColor = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <DashboardLayout title="Platform Calendar & Meetings" subtitle="Admin Portal">
      <div className="mb-6 flex gap-2">
        {[
          { id: "calendar", label: "📅 Master Platform Calendar" },
          { id: "list", label: "📋 All Scheduled Sessions" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
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
          <CalendarView events={meetings} userRole="admin" />

          <div className="glass-card p-6">
            <h3 className="section-title mb-4">All System Sessions</h3>
            <div className="space-y-3">
              {meetings.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No platform meetings recorded.</p>
              ) : (
                meetings.map((m) => (
                  <div key={m._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="font-bold">{m.topic}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Student: {m.studentId?.name || "Student"} | Mentor: {m.mentorId?.name || "Mentor"} · {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openGoogleMeet(m)}
                        className="btn-primary !py-1 !px-2.5 text-xs flex items-center gap-1"
                      >
                        📹 Meet
                      </button>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[m.status] || ""}`}>
                        {m.status}
                      </span>
                    </div>
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
                    Student: <strong>{m.studentId?.name}</strong> ({m.studentId?.email}) | Mentor: <strong>{m.mentorId?.name}</strong> ({m.mentorId?.email})
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Date: {new Date(m.scheduledDate).toLocaleDateString()} at {m.scheduledTime} ({m.duration} mins)
                  </p>
                  {m.agenda && <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Agenda: {m.agenda}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[m.status] || ""}`}>
                  {m.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(m._id, "accepted")} className="btn-primary !py-1.5 text-xs">
                      Approve & Send Link
                    </button>
                    <button onClick={() => updateStatus(m._id, "rejected")} className="btn-secondary !py-1.5 text-xs text-red-500">
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={() => openGoogleMeet(m)}
                  className="btn-primary !py-1.5 text-xs flex items-center gap-1.5"
                >
                  📹 Launch / View Google Meet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
