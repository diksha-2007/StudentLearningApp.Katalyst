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
  X,
} from "lucide-react";

const Sidebar = ({ role = "student", mobileOpen = false, onClose }) => {
  const studentLinks = [
    { name: "Dashboard", path: "/student", icon: LayoutDashboard },
    { name: "Trainings", path: "/student/trainings", icon: BookOpen },
    { name: "Calendar & Meetings", path: "/student/meetings", icon: CalendarDays },
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
    { name: "Students", path: "/admin/students", icon: GraduationCap },
    { name: "Mentors", path: "/admin/mentors", icon: Users },
    { name: "Trainings", path: "/admin/trainings", icon: BookOpen },
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
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600">Katalyst</h1>
            <p className="text-[10px] text-gray-500">Learning Platform</p>
          </div>
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
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            {role === "admin" ? (
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            ) : role === "mentor" ? (
              <Users className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500">Logged in as</p>
            <p className="truncate text-sm font-semibold capitalize text-gray-800">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Menu</p>
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
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
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