import { useState, useEffect } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import API from "../api";
import { Bell, CheckCircle2, Trash2, Calendar, BookOpen, Trophy } from "lucide-react";

export default function NotificationsPage({ userRole = "student" }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    API.get("/notifications")
      .then((res) => setNotifications(res.data.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    await API.put("/notifications/read-all");
    fetchNotifications();
  };

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await API.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case "meeting": return <Calendar className="h-5 w-5 text-blue-500" />;
      case "training": return <BookOpen className="h-5 w-5 text-green-500" />;
      case "certificate": return <Trophy className="h-5 w-5 text-yellow-500" />;
      default: return <Bell className="h-5 w-5 text-katalyst-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Notifications Center"
      subtitle={`${userRole.toUpperCase()} PORTAL`}
      actions={
        <button onClick={markAllRead} className="btn-secondary !py-2 text-xs font-semibold">
          ✓ Mark All as Read
        </button>
      }
    >
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-bold text-lg">No Notifications</h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            You're all caught up! Updates regarding meetings and courses will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`glass-card p-5 flex items-start justify-between gap-4 transition-all ${
                !n.isRead ? "border-l-4 border-l-katalyst-500 bg-katalyst-50/20" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
                  {getIcon(n.type)}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {n.title}
                    {!n.isRead && (
                      <span className="rounded-full bg-katalyst-500 px-2 py-0.5 text-[10px] text-white font-semibold">
                        NEW
                      </span>
                    )}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {n.message}
                  </p>
                  <span className="text-xs mt-2 block" style={{ color: "var(--text-muted)" }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
