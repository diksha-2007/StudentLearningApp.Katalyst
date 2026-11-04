import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Award,
  X,
} from "lucide-react";
import BrandMark from "../BrandMark";

const Sidebar = ({ role = "student", mobileOpen = false, onClose }) => {
  const studentLinks = [
    { name: "Dashboard", path: "/student", icon: LayoutDashboard },
    { name: "🌟 Schemes & Rural Hub", path: "/student/hub", icon: Sparkles },
    { name: "Trainings & Playlists", path: "/student/trainings", icon: BookOpen },
    { name: "Calendar & Meetings", path: "/student/meetings", icon: CalendarDays },
    { name: "Certificates", path: "/student/certificates", icon: Award },
    { name: "Notifications", path: "/student/notifications", icon: Bell },
    { name: "Profile", path: "/student/profile", icon: User },
  ];

  const mentorLinks = [
    { name: "Dashboard", path: "/mentor", icon: LayoutDashboard },
    { name: "Students", path: "/mentor/students", icon: Users },
    { name: "Calendar & Meetings", path: "/mentor/meetings", icon: CalendarDays },
    { name: "Notifications", path: "/mentor/notifications", icon: Bell },
    { name: "Profile", path: "/mentor/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "🌟 Manage Schemes Hub", path: "/admin/hub", icon: Sparkles },
    { name: "Students", path: "/admin/students", icon: GraduationCap },
    { name: "Mentors", path: "/admin/mentors", icon: Users },
    { name: "Trainings & Playlists", path: "/admin/trainings", icon: BookOpen },
    { name: "Calendar & Meetings", path: "/admin/meetings", icon: CalendarDays },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
  ];

  let links = studentLinks;
  if (role === "mentor") links = mentorLinks;
  if (role === "admin") links = adminLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r" style={{ borderColor: "var(--border)", background: "var(--bg-glass)", backdropFilter: "blur(16px)" }}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-5" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <BrandMark />
        </div>
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role Badge */}
      <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--accent-light)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-katalyst-100">
            {role === "admin" ? (
              <ShieldCheck className="h-4 w-4 text-katalyst-600" />
            ) : role === "mentor" ? (
              <Users className="h-4 w-4 text-katalyst-600" />
            ) : (
              <User className="h-4 w-4 text-katalyst-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Logged in as</p>
            <p className="truncate text-sm font-semibold capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Menu</p>
        <div className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/${role}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-katalyst-500 text-white shadow-md"
                      : "hover:bg-katalyst-50 hover:text-katalyst-600"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom: Logout */}
      <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible, takes up space in flow */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="fixed left-0 top-0 z-40 h-screen w-64">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar — slide-in drawer with backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          {/* Drawer */}
          <div className="relative h-full w-64 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;