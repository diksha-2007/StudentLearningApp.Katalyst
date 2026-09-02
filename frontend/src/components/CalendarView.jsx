import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, User, ExternalLink, X } from "lucide-react";
import { openGoogleMeet, getGoogleMeetLink } from "../utils/meetUtils";

export default function CalendarView({ events = [], onSelectDate, userRole = "student" }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Match events to days
  const getEventsForDay = (day) => {
    return events.filter((e) => {
      const eDate = new Date(e.scheduledDate || e.date || e.createdAt);
      return (
        eDate.getDate() === day &&
        eDate.getMonth() === month &&
        eDate.getFullYear() === year
      );
    });
  };

  const statusColors = {
    accepted: "bg-green-500 text-white",
    pending: "bg-amber-500 text-white",
    rejected: "bg-red-500 text-white",
    completed: "bg-blue-600 text-white",
  };

  return (
    <div className="glass-card p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-katalyst-500 text-white">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Interactive Schedule & Meeting Calendar ({userRole.toUpperCase()})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-secondary !p-2">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="btn-secondary !py-1.5 text-xs font-semibold">
            Today
          </button>
          <button onClick={nextMonth} className="btn-secondary !p-2">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs mb-2 text-gray-500 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty padding days for previous month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 rounded-xl bg-gray-50/30 dark:bg-gray-800/10 opacity-30" />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              onClick={() => onSelectDate && onSelectDate(new Date(year, month, day))}
              className={`h-24 rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer hover:border-katalyst-400 hover:shadow-sm ${
                isToday ? "border-katalyst-500 bg-katalyst-500/10 font-bold" : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isToday ? "text-katalyst-500 font-bold" : ""}`}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-katalyst-500 animate-pulse" />
                )}
              </div>

              {/* Day Events Badge List */}
              <div className="space-y-1 overflow-y-auto max-h-14">
                {dayEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMeeting(ev);
                    }}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-90 ${
                      statusColors[ev.status] || "bg-katalyst-500 text-white"
                    }`}
                    title={`${ev.topic || ev.title} - Click to view details & Google Meet link`}
                  >
                    {ev.scheduledTime ? `${ev.scheduledTime} ` : ""}
                    {ev.topic || ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Meeting Google Meet Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[selectedMeeting.status] || "bg-blue-600 text-white"}`}>
                  {selectedMeeting.status || "Scheduled"}
                </span>
                <h3 className="text-lg font-bold mt-2">{selectedMeeting.topic || selectedMeeting.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              <p className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <span>Date: {new Date(selectedMeeting.scheduledDate || selectedMeeting.date).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Time: {selectedMeeting.scheduledTime || "Flexible"} ({selectedMeeting.duration || 45} mins)</span>
              </p>
              {selectedMeeting.mentorId && (
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span>Mentor: {selectedMeeting.mentorId?.name || "Assigned Mentor"}</span>
                </p>
              )}
              {selectedMeeting.agenda && (
                <p className="text-xs mt-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700">
                  <strong>Agenda:</strong> {selectedMeeting.agenda}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedMeeting(null)} 
                className="btn-secondary flex-1 text-xs !py-2.5"
              >
                Close
              </button>
              <button 
                onClick={() => openGoogleMeet(selectedMeeting)} 
                className="btn-primary flex-1 text-xs !py-2.5 flex items-center justify-center gap-2"
              >
                <Video className="h-4 w-4" />
                <span>Join Google Meet</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
