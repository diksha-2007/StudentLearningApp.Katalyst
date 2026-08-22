import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifyMsg, setNotifyMsg] = useState({ title: "", message: "", targetRole: "student" });

  useEffect(() => {
    API.get("/admin/reports")
      .then((res) => setReports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sendNotification = async (e) => {
    e.preventDefault();
    await API.post("/admin/notify", notifyMsg);
    alert("Notification sent!");
    setNotifyMsg({ title: "", message: "", targetRole: "student" });
  };

  return (
    <DashboardLayout title="Reports & Notifications" subtitle="Admin Portal">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Platform Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg p-3" style={{ background: "var(--accent-light)" }}>
                <span className="text-sm">Students Tracked</span>
                <span className="font-bold text-katalyst-500">{reports?.progressData?.length || 0}</span>
              </div>
              {(reports?.meetingReport || []).map((item) => (
                <div key={item._id} className="flex justify-between rounded-lg p-3" style={{ background: "var(--accent-light)" }}>
                  <span className="text-sm capitalize">Meetings: {item._id}</span>
                  <span className="font-bold text-katalyst-500">{item.count}</span>
                </div>
              ))}
              {(reports?.categoryEnrollment || []).map((item) => (
                <div key={item._id} className="flex justify-between rounded-lg p-3" style={{ background: "var(--accent-light)" }}>
                  <span className="text-sm">{item._id}</span>
                  <span className="font-bold text-katalyst-500">{item.totalEnrollments} enrollments</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Send Bulk Notification</h3>
            <form onSubmit={sendNotification} className="space-y-3">
              <select className="input-field" value={notifyMsg.targetRole}
                onChange={(e) => setNotifyMsg({ ...notifyMsg, targetRole: e.target.value })}>
                <option value="student">All Students</option>
                <option value="mentor">All Mentors</option>
                <option value="all">Everyone</option>
              </select>
              <input className="input-field" placeholder="Title" value={notifyMsg.title}
                onChange={(e) => setNotifyMsg({ ...notifyMsg, title: e.target.value })} required />
              <textarea className="input-field" rows={3} placeholder="Message" value={notifyMsg.message}
                onChange={(e) => setNotifyMsg({ ...notifyMsg, message: e.target.value })} required />
              <button type="submit" className="btn-primary w-full">Send Notification</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
