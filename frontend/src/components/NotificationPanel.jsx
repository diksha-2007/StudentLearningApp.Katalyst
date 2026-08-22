import { useState, useEffect } from "react";
import API from "../api";

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotifications(res.data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await API.put("/notifications/read-all");
    setNotifications((n) => n.map((item) => ({ ...item, isRead: true })));
  };

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    setNotifications((n) =>
      n.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 glass-card animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="text-xs text-katalyst-500 hover:underline">
            Mark all read
          </button>
          <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Loading...
          </p>
        ) : notifications.length === 0 ? (
          <p className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`cursor-pointer border-b p-4 transition-colors hover:bg-katalyst-50 dark:hover:bg-katalyst-900/20 ${
                !n.isRead ? "bg-katalyst-50/50 dark:bg-katalyst-900/10" : ""
              }`}
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                {n.message}
              </p>
              <span className="mt-1 block text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
