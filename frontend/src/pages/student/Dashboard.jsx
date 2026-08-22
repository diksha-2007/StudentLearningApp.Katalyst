import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#ec4899", "#f472b6", "#fbcfe8", "#fce7f3"];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/students/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Student Portal">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      </DashboardLayout>
    );
  }

  const progress = data?.progress || {};
  const overall = progress.overallScore || 0;

  const chartData = [
    { name: "Training", value: progress.trainingCompletion || 0 },
    { name: "Meetings", value: progress.meetingsAttended ? (progress.meetingsAttended / Math.max(progress.totalMeetingsScheduled, 1)) * 100 : 0 },
    { name: "Quiz", value: progress.quizScores?.length ? progress.quizScores.reduce((a, q) => a + (q.score / q.maxScore) * 100, 0) / progress.quizScores.length : 0 },
    { name: "Attendance", value: progress.attendanceRate || 0 },
  ];

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(" ")[0] || "Student"}`} subtitle="Student Portal">
      {/* Overall progress */}
      <div className="glass-card mb-6 flex flex-col items-center gap-6 p-6 sm:flex-row">
        <div className="h-36 w-36">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[{ value: overall }, { value: 100 - overall }]} cx="50%" cy="50%"
                innerRadius={45} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270}>
                <Cell fill="#ec4899" />
                <Cell fill="#fce7f3" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="-mt-[88px] text-center">
            <p className="text-2xl font-bold">{overall}%</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Overall</p>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Your Learning Progress</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Placement Readiness: <strong className="text-katalyst-500">{progress.placementReadiness || 0}%</strong>
          </p>
          <div className="progress-bar mt-4">
            <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Training Progress" value={`${progress.trainingCompletion || 0}%`} subtitle="Keep going!" icon="📚" />
        <StatCard title="Meetings" value={`${progress.meetingsAttended || 0}/${progress.totalMeetingsScheduled || 0}`} subtitle="Attended" icon="📅" />
        <StatCard title="Certificates" value={data?.certificates || 0} subtitle="Earned" icon="🏆" />
        <StatCard title="Notifications" value={data?.unreadNotifications || 0} subtitle="Unread" icon="🔔" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrolled trainings */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Your Trainings</h3>
            <Link to="/student/trainings" className="text-sm text-katalyst-500 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(data?.enrolledTrainings || []).length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No trainings enrolled yet.</p>
            ) : (
              data.enrolledTrainings.map((t) => (
                <div key={t._id} className="flex items-center justify-between rounded-xl p-3"
                  style={{ background: "var(--accent-light)" }}>
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.category}</p>
                  </div>
                  <span className="font-bold text-katalyst-500">
                    {t.isCompleted ? "✓ Done" : `${t.completedVideos} videos`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming meetings */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Upcoming Meetings</h3>
            <Link to="/student/meetings" className="text-sm text-katalyst-500 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(data?.upcomingMeetings || []).length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No upcoming meetings.</p>
            ) : (
              data.upcomingMeetings.map((m) => (
                <div key={m._id} className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <p className="font-medium">{m.topic}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    with {m.mentorId?.name} · {new Date(m.scheduledDate).toLocaleDateString()} {m.scheduledTime}
                  </p>
                  {m.meetLink && (
                    <a href={m.meetLink} target="_blank" rel="noreferrer"
                      className="mt-2 inline-block text-xs text-katalyst-500 hover:underline">
                      Join Google Meet →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Progress breakdown chart */}
      <div className="glass-card mt-6 p-6">
        <h3 className="section-title mb-4">Progress Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {chartData.map((item, i) => (
            <div key={item.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-bold text-katalyst-500">{Math.round(item.value)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${item.value}%`, background: COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
