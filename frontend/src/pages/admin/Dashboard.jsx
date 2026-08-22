import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import API from "../../api";

const COLORS = ["#ec4899", "#f472b6", "#fbcfe8", "#db2777", "#be185d"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Admin Portal">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};
  const pieData = [
    { name: "Completed", value: stats.completedMeetings || 0 },
    { name: "Pending", value: stats.pendingMeetings || 0 },
    { name: "Other", value: Math.max(0, (stats.totalMeetings || 0) - (stats.completedMeetings || 0) - (stats.pendingMeetings || 0)) },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Admin Portal">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={stats.totalStudents || 0} icon="🎓" />
        <StatCard title="Total Mentors" value={stats.totalMentors || 0} icon="👨‍🏫" />
        <StatCard title="Trainings" value={stats.totalTrainings || 0} icon="📚" />
        <StatCard title="Certificates" value={stats.totalCertificates || 0} icon="🏆" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Top Trainings by Enrollment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.topTrainings || []}>
              <XAxis dataKey="title" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Meeting Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card mt-6 p-6">
        <h3 className="section-title mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/admin/students", label: "👨‍🎓 Manage Students" },
            { to: "/admin/mentors", label: "👨‍🏫 Manage Mentors" },
            { to: "/admin/trainings", label: "📚 Manage Trainings" },
            { to: "/admin/reports", label: "📊 View Reports" },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="btn-secondary text-left !py-4">{a.label}</Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
