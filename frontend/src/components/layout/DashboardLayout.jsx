import { useState, useEffect } from "react";
import NotificationPanel from "../NotificationPanel";
import ChatBot from "../ChatBot";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";

export default function DashboardLayout({ title, subtitle, children, actions }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {});
  }, [showNotifs]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Sidebar role={user?.role || "student"} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:px-8"
          style={{ borderColor: "var(--border)", background: "var(--bg-glass)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="btn-secondary !p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <div>
              {subtitle && <p className="section-subtitle">{subtitle}</p>}
              <h1 className="text-lg font-bold lg:text-xl">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="btn-secondary !rounded-full !p-2.5 text-lg relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>

      <ChatBot />
    </div>
  );
}
