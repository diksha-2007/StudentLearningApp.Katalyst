import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/mentors/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const respond = async (id, status) => {
    try {
      await API.put(`/mentors/meeting/${id}`, { status });
      const res = await API.get("/mentors/dashboard");
      setData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Mentor Portal">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};
  const chartData = (data?.mentor?.assignedStudents || []).slice(0, 5).map((s) => ({
    name: s.name?.split(" ")[0] || "Student",
    progress: Math.floor(Math.random() * 40 + 60),
  }));

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(" ")[0] || "Mentor"}`} subtitle="Mentor Portal">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={stats.totalStudents || 0} icon="🎓" />
        <StatCard title="Pending Requests" value={stats.pendingRequests || 0} subtitle="Need action" icon="⏳" />
        <StatCard title="Completed Meetings" value={stats.completedMeetings || 0} icon="✅" />
        <StatCard title="Rating" value={`${stats.rating || 5}/5`} icon="⭐" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending requests */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Pending Requests</h3>
            <Link to="/mentor/meetings" className="text-sm text-katalyst-500 hover:underline">View all →</Link>
          </div>
          {(data?.pendingMeetings || []).length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No pending requests.</p>
          ) : (
            data.pendingMeetings.slice(0, 3).map((m) => (
              <div key={m._id} className="mb-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="font-medium">{m.topic}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {m.studentId?.name} · {new Date(m.scheduledDate).toLocaleDateString()} {m.scheduledTime}
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => respond(m._id, "accepted")} className="btn-primary !py-1.5 text-xs">Accept</button>
                  <button onClick={() => respond(m._id, "rejected")} className="btn-secondary !py-1.5 text-xs">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upcoming meetings */}
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Upcoming Meetings</h3>
          {(data?.upcomingMeetings || []).length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No upcoming meetings.</p>
          ) : (
            data.upcomingMeetings.map((m) => (
              <div key={m._id} className="mb-3 rounded-xl p-3" style={{ background: "var(--accent-light)" }}>
                <p className="font-medium">{m.topic}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {m.studentId?.name} · {new Date(m.scheduledDate).toLocaleDateString()}
                </p>
                {m.meetLink && (
                  <a href={m.meetLink} target="_blank" rel="noreferrer" className="text-xs text-katalyst-500 hover:underline">
                    Join Meet →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="glass-card mt-6 p-6">
          <h3 className="section-title mb-4">Student Progress Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="progress" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardLayout>
  );
}
