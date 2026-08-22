import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, User } from "lucide-react";

export default function CalendarView({ events = [], onSelectDate, userRole = "student" }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    completed: "bg-purple-600 text-white",
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
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      statusColors[ev.status] || "bg-katalyst-500 text-white"
                    }`}
                    title={`${ev.topic || ev.title} - ${ev.scheduledTime || ""}`}
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
    </div>
  );
}
