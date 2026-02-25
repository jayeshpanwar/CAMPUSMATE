import React, { useEffect, useMemo, useState } from "react";
import { getProfile, getChatGroups, getGroupMessages, sendGroupMessage } from "./api";
import SharedMessagesPage from './SharedMessagesPage';

const SidebarIcon = ({ children, className }) => (
  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${className}`}>
    {children}
  </div>
);

const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClipboardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TeachersHome = ({ notices, events, insights }) => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white text-gray-900 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold">Live Notices</h3>
        <ul className="mt-4 space-y-4">
          {notices.map((notice) => (
            <li key={notice.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500">{notice.category}</p>
              <p className="mt-2 text-base font-semibold text-gray-900">{notice.title}</p>
              <p className="mt-1 text-sm text-gray-500">{notice.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white text-gray-900 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <ul className="mt-4 space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex items-start justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{event.audience}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">{event.type}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white text-gray-900 rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
        <h3 className="text-lg font-semibold">Faculty Insights</h3>
        <div className="mt-4 space-y-4 flex-1">
          {insights.map((item) => (
            <article key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.detail}</p>
            </article>
          ))}
        </div>
        <button className="mt-auto w-full bg-gray-900 text-white rounded-xl py-3 font-semibold hover:bg-black transition">
          Export Summary
        </button>
      </div>
    </section>
  </div>
);

const TeachersCalendar = ({
  currentDate,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  events,
  onOpenModal,
  onCloseModal,
  isModalOpen,
  form,
  onFormChange,
  onCreate
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
  const selectedDateEvents = events.filter((event) => event.date === selectedDateKey);

  const dayHasEvent = (dayNumber) => {
    const key = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).toLocaleDateString("en-CA");
    return events.some((event) => event.date === key);
  };

  const CalendarModal = () => (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <p className="text-lg font-semibold text-gray-900">Create calendar broadcast</p>
          <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-900">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCreate();
          }}
          className="px-6 py-6 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <label className="text-sm font-medium text-gray-700">
              Title
              <input name="title" value={form.title} onChange={onFormChange} placeholder="Session or announcement title" className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" required />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-gray-700">
                Date
                <input name="date" type="date" value={form.date} onChange={onFormChange} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" required />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Time
                <input name="time" type="time" value={form.time} onChange={onFormChange} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" required />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-gray-700">
                Branch
                <select name="branch" value={form.branch} onChange={onFormChange} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                  <option value="">Select branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="EE">EE</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Year
                <select name="year" value={form.year} onChange={onFormChange} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                  <option value="">Select year</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                </select>
              </label>
            </div>
            <label className="text-sm font-medium text-gray-700">
              Details for students
              <textarea name="details" value={form.details} onChange={onFormChange} rows={3} placeholder="Add agenda, preparation pointers, or attachments" className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCloseModal} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black">
              Broadcast Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {isModalOpen && <CalendarModal />}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onPrevMonth} className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-900">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{monthLabel}</h2>
          <button onClick={onNextMonth} className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-900">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 text-xs uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 border border-gray-100 bg-gray-50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNumber = index + 1;
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
            const isSelected = cellDate.toDateString() === selectedDate.toDateString();
            const hasEvent = dayHasEvent(dayNumber);

            return (
              <button
                type="button"
                key={dayNumber}
                onClick={() => onSelectDate(cellDate)}
                className={`h-24 border border-gray-100 flex flex-col items-center justify-start p-2 transition ${isSelected ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${isSelected ? "bg-black text-white" : "text-gray-700"}`}>
                  {dayNumber}
                </span>
                {hasEvent && <span className={`mt-1 inline-flex h-2 w-2 rounded-full ${isSelected ? "bg-white" : "bg-gray-900"}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Selected date</p>
            <p className="text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <button onClick={onOpenModal} className="px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black">
            Create Event
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No broadcasts scheduled for this date.</p>
          ) : (
            selectedDateEvents
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((event) => (
                <article key={event.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{event.branch} • Year {event.year}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                  {event.description && <p className="mt-2 text-sm text-gray-600">{event.description}</p>}
                </article>
              ))
          )}
        </div>

        {events.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">Upcoming broadcasts</p>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {events
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => (
                  <div key={`list-${event.id}`} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">{event.branch} / Year {event.year}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TeachersSearch = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
    <header>
      <h3 className="text-xl font-semibold text-gray-900">Search Directory</h3>
      <p className="text-sm text-gray-500">Find students, faculty, or resources instantly.</p>
    </header>
    <div className="flex flex-col md:flex-row gap-4">
      <input className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Search by name, roll number, or keyword" />
      <button className="px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition">Filter</button>
    </div>
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-gray-600 text-sm">
      Search results appear here. Integrate with the backend directory to enable smart lookups.
    </div>
  </div>
);

const TeachersNoDues = ({ requests, onDecision }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Pending No-Dues</h3>
        <p className="text-sm text-gray-500">Approve or decline student requests with remarks.</p>
      </div>
      <div className="flex gap-3">
        <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>Filter by Branch</option>
          <option>CSE</option>
          <option>ECE</option>
        </select>
        <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>Filter by Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Declined</option>
        </select>
      </div>
    </header>

    <div className="overflow-x-auto border border-gray-200 rounded-2xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Student</th>
            <th className="px-4 py-3 text-left font-medium">Branch / Year</th>
            <th className="px-4 py-3 text-left font-medium">Requested For</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Remark</th>
            <th className="px-4 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-semibold text-gray-900">{request.name}</p>
                <p className="text-xs text-gray-500">{request.roll}</p>
              </td>
              <td className="px-4 py-3">{request.branch} • {request.year}</td>
              <td className="px-4 py-3">{request.subject}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${request.status === "Pending" ? "border-gray-300 text-gray-600" : request.status === "Approved" ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}`}>
                  {request.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <textarea value={request.remark} onChange={(event) => onDecision(request.id, request.status, event.target.value)} className="w-48 bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Add remark" />
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onDecision(request.id, "Approved", request.remark)} className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-black transition">Approve</button>
                <button onClick={() => onDecision(request.id, "Declined", request.remark)} className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-gray-900 transition">Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TeachersTimetable = ({ schedule }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Teaching Schedule</h3>
        <p className="text-sm text-gray-500">Daily sessions, invigilation, and mentorship slots.</p>
      </div>
      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition">Download PDF</button>
    </header>
    <div className="overflow-x-auto border border-gray-200 rounded-2xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Time</th>
            <th className="px-4 py-3 text-left font-medium">Course</th>
            <th className="px-4 py-3 text-left font-medium">Batch / Room</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {schedule.map((slot) => (
            <tr key={`${slot.time}-${slot.course}`}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-900">{slot.time}</td>
              <td className="px-4 py-3 text-gray-900">{slot.course}</td>
              <td className="px-4 py-3">{slot.batch}</td>
              <td className="px-4 py-3">{slot.type}</td>
              <td className="px-4 py-3 text-gray-500">{slot.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TeachersProfileCard = ({ user, availability, onToggleAvailability }) => (
  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 text-gray-900">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg font-semibold">{user.initials}</div>
      <div>
        <p className="text-base font-semibold text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
    <div className="mt-4 space-y-2 text-sm text-gray-600">
      <p>Department: {user.department || "Faculty"}</p>
      <p>Extension: {user.extension || "N/A"}</p>
      <p>Office Hours: {user.officeHours || "10:00 - 16:00"}</p>
    </div>
    <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
      <span className="text-sm text-gray-600">Availability</span>
      <button onClick={onToggleAvailability} className={`px-3 py-1 text-xs font-semibold rounded-lg border ${availability ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-300 text-gray-600"}`}>
        {availability ? "Visible" : "On Leave"}
      </button>
    </div>
  </div>
);

const navItems = [
  { key: "Home", icon: HomeIcon },
  { key: "Messages", icon: MessageIcon },
  { key: "Search", icon: SearchIcon },
  { key: "Calendar", icon: CalendarIcon },
  { key: "No-Dues", icon: ClipboardIcon },
  { key: "Timetable", icon: CalendarIcon }
];

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [availability, setAvailability] = useState(true);
  const [calendarCursor, setCalendarCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarForm, setCalendarForm] = useState({ title: "", date: "", branch: "", year: "", time: "10:00", details: "" });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState({});
  const [noDuesRequests, setNoDuesRequests] = useState([
    { id: 1, name: "Anuj Patel", roll: "CSE21045", branch: "CSE", year: "4th", subject: "Library Clearance", status: "Pending", remark: "" },
    { id: 2, name: "Sneha Iyer", roll: "ECE20112", branch: "ECE", year: "4th", subject: "Lab Equipment", status: "Approved", remark: "Cleared on 20 Jan" },
    { id: 3, name: "Rahul Sen", roll: "CSE21067", branch: "CSE", year: "4th", subject: "Hostel", status: "Declined", remark: "Submit dues receipt" }
  ]);
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "Hackathon Briefing", date: "2026-02-02", time: "17:00", branch: "CSE", year: "3", description: "Orientation for Smart Campus Hackathon" },
    { id: 2, title: "Industry Talk", date: "2026-02-05", time: "11:00", branch: "ECE", year: "4", description: "AI in Communication Systems" },
    { id: 3, title: "Mid-term Review", date: "2026-02-12", time: "14:00", branch: "CSE", year: "4", description: "Project milestone evaluation" }
  ]);
  const [timetable, setTimetable] = useState([
    { time: "09:00 - 10:00", course: "AI Foundations", batch: "CSE 6th Sem • Room 304", type: "Lecture", note: "Lab on Thursday" },
    { time: "10:15 - 11:15", course: "Project Mentorship", batch: "Capstone Group A", type: "Mentoring", note: "Prototype review" },
    { time: "12:00 - 13:00", course: "Faculty Council", batch: "Staff Room", type: "Meeting", note: "Academic planning" },
    { time: "14:00 - 16:00", course: "AI Lab", batch: "CSE 6th Sem • Lab 2", type: "Practical", note: "Neural nets hands-on" }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("accessToken");
        const storedRole = localStorage.getItem("user_role");
        const fallbackUser = {
          name: localStorage.getItem("user_name") || "Faculty Member",
          email: localStorage.getItem("user_email") || "faculty@example.com",
          role: storedRole || "faculty",
          department: localStorage.getItem("user_department") || "Computer Science",
          initials: (localStorage.getItem("user_name") || "FM").slice(0, 2).toUpperCase()
        };

        if (!token) {
          setUser(fallbackUser);
          return;
        }

        try {
          const response = await getProfile();
          const data = response.data || {};
          const profileUser = {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email || fallbackUser.name,
            email: data.email || fallbackUser.email,
            role: data.role || fallbackUser.role,
            department: data.department || fallbackUser.department,
            extension: data.extension || "402",
            officeHours: data.office_hours || "10:00 - 16:00",
            initials: ((data.first_name || data.email || fallbackUser.name).slice(0, 2) || "FM").toUpperCase()
          };
          setUser(profileUser);
        } catch (profileError) {
          console.warn("Profile load failed", profileError);
          setUser(fallbackUser);
        }
      } catch (error) {
        console.error("Teacher dashboard init failed", error);
        setUser({ name: "Faculty Member", email: "faculty@example.com", role: "faculty", initials: "FM" });
      }
    };

    fetchProfile();
  }, []);

  // Fetch chat groups from backend API
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const groupsResponse = await getChatGroups();
        const groups = groupsResponse.data || [];
        
        // Convert backend groups to conversation format
        const convos = groups.map(group => ({
          id: group.id,
          name: group.name,
          avatar: group.name.charAt(0).toUpperCase(),
          group: group.description || 'Group Chat',
          lastMessage: group.last_message?.content || 'No messages yet',
          time: group.updated_at ? new Date(group.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'
        }));
        
        setConversations(convos);
        
        // Fetch messages for each group
        const msgData = {};
        for (const group of groups) {
          try {
            const messagesResponse = await getGroupMessages(group.id);
            const messages = messagesResponse.data || [];
            
            msgData[group.id] = messages.map((msg) => ({
              sender: msg.sender?.first_name || msg.sender?.email || 'Unknown',
              text: msg.content,
              avatar: (msg.sender?.first_name || msg.sender?.email || 'U').slice(0, 2).toUpperCase(),
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
          } catch (msgErr) {
            console.warn(`Failed to fetch messages for group ${group.id}`, msgErr);
            msgData[group.id] = [];
          }
        }
        
        setConversationMessages(msgData);
        
        // Set first conversation as active
        if (convos.length > 0) {
          setActiveConversationId(convos[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch chat groups:', err);
      }
    };

    fetchChatData();
  }, []);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  const notices = useMemo(
    () => [
      { id: 1, title: "Exam invigilation roster published", timestamp: "Updated 25 Jan, 18:30", category: "Assessment" },
      { id: 2, title: "Research proposal submissions due 31 Jan", timestamp: "Updated 24 Jan, 12:10", category: "Research" },
      { id: 3, title: "Faculty development workshop registration", timestamp: "Updated 22 Jan, 09:05", category: "Development" }
    ],
    []
  );

  const events = useMemo(
    () => [
      { id: 1, title: "Campus Innovation Fair", date: "30 Jan", audience: "All branches", type: "Showcase" },
      { id: 2, title: "Parent Teacher Meet", date: "04 Feb", audience: "Year 1", type: "Outreach" },
      { id: 3, title: "Curriculum Review", date: "12 Feb", audience: "Academic Council", type: "Committee" }
    ],
    []
  );

  const insights = useMemo(
    () => [
      { id: 1, label: "Pending Reviews", value: "08", detail: "Capstone submissions awaiting feedback" },
      { id: 2, label: "Sessions This Week", value: "12", detail: "Including mentoring hours" },
      { id: 3, label: "Student Queries", value: "15", detail: "Reply within 24 hours" }
    ],
    []
  );

  const handleNoDuesDecision = (id, status, remark) => {
    setNoDuesRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status, remark } : request)));
  };

  const handleCalendarFormChange = (event) => {
    const { name, value } = event.target;
    setCalendarForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalendarCreate = () => {
    const selectedDateIso = selectedDate.toISOString().split("T")[0];
    const eventDate = calendarForm.date || selectedDateIso;
    if (!calendarForm.title || !eventDate || !calendarForm.branch || !calendarForm.year) {
      return;
    }
    const newEvent = {
      id: Date.now(),
      title: calendarForm.title,
      date: eventDate,
      time: calendarForm.time || "10:00",
      branch: calendarForm.branch,
      year: calendarForm.year,
      description: calendarForm.details?.trim() || ""
    };
    setCalendarEvents((prev) => [newEvent, ...prev]);
    setCalendarForm({ title: "", date: "", branch: "", year: "", time: "10:00", details: "" });
    setIsCalendarModalOpen(false);
    const [year, month, day] = eventDate.split("-").map(Number);
    setCalendarCursor(new Date(year, month - 1, 1));
    setSelectedDate(new Date(year, month - 1, day));
  };

  const handlePrevMonth = () => {
    setCalendarCursor((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      setSelectedDate(next);
      setCalendarForm((prevForm) => ({ ...prevForm, date: next.toLocaleDateString("en-CA") }));
      return next;
    });
  };

  const handleNextMonth = () => {
    setCalendarCursor((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      setSelectedDate(next);
      setCalendarForm((prevForm) => ({ ...prevForm, date: next.toLocaleDateString("en-CA") }));
      return next;
    });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setCalendarForm((prev) => ({ ...prev, date: date.toLocaleDateString("en-CA") }));
  };

  const handleOpenCalendarModal = () => {
    const defaultDate = selectedDate.toLocaleDateString("en-CA");
    setCalendarForm((prev) => ({
      ...prev,
      date: prev.date || defaultDate,
      time: prev.time || "10:00"
    }));
    setIsCalendarModalOpen(true);
  };

  const handleCloseCalendarModal = () => {
    setIsCalendarModalOpen(false);
  };

  const renderPage = () => {
    switch (activeNav) {
      case "Home":
        return <TeachersHome notices={notices} events={events} insights={insights} />;
      case "Messages":
        return (
          <SharedMessagesPage
            conversations={conversations}
            setConversations={setConversations}
            allMessages={conversationMessages}
            setAllMessages={setConversationMessages}
            allUsers={[]}
            currentUser={user || { name: 'Faculty', initials: 'FM' }}
          />
        );
      case "Search":
        return <TeachersSearch />;
      case "Calendar":
        return (
          <TeachersCalendar
            currentDate={calendarCursor}
            selectedDate={selectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={handleSelectDate}
            events={calendarEvents}
            onOpenModal={handleOpenCalendarModal}
            onCloseModal={handleCloseCalendarModal}
            isModalOpen={isCalendarModalOpen}
            onCreate={handleCalendarCreate}
            form={calendarForm}
            onFormChange={handleCalendarFormChange}
          />
        );
      case "No-Dues":
        return <TeachersNoDues requests={noDuesRequests} onDecision={handleNoDuesDecision} />;
      case "Timetable":
        return <TeachersTimetable schedule={timetable} />;
      default:
        return <TeachersHome notices={notices} events={events} insights={insights} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed md:static top-0 left-0 z-30 h-full w-72 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="px-6 py-8 border-b border-gray-200">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">CampusMate</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Faculty Panel</h1>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} onClick={() => { setActiveNav(item.key); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition ${isActive ? "border-gray-900 bg-gray-900 text-white" : "border-transparent hover:border-gray-200 hover:bg-gray-50"}`}>
                <SidebarIcon className={isActive ? "bg-white text-gray-900" : "bg-gray-100 text-gray-500"}>
                  <Icon className="h-5 w-5" />
                </SidebarIcon>
                <span className={`text-sm font-semibold text-left ${isActive ? "text-white" : "text-gray-700"}`}>{item.key}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="md:hidden p-2 border border-gray-200 rounded-lg text-gray-600">
              <MenuIcon className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900">{activeNav}</h2>
          </div>
          <div className="relative">
            <button onClick={() => setIsProfileOpen((prev) => !prev)} className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold">{user.initials}</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{availability ? "Available" : "On Leave"}</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>
            {isProfileOpen && (
              <TeachersProfileCard
                user={user}
                availability={availability}
                onToggleAvailability={() => setAvailability((prev) => !prev)}
              />
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-6 md:px-10 md:py-10 overflow-y-auto bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
