import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  getChatGroups,
  getGroupMessages,
  getFacultyNotices,
  createFacultyNotice,
  getNoDuesSubjects,
  createNoDuesSubject,
  getNoDuesApplications,
  reviewNoDuesApplication,
  getFacultyStudents,
  enterStudentMarks,
  bulkEnterStudentMarks,
} from "./api";
import SharedMessagesPage from './SharedMessagesPage';
import AttendancePage from './AttendancePage';
import FacultyAvailabilityPage from './FacultyAvailabilityPage';

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

const SettingsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

const AttendanceIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const TeachersHome = ({
  notices,
  events,
  insights,
  noticeForm,
  onNoticeFormChange,
  onPublishNotice,
  noticeGroups,
  noticePublishState,
  isPublishingNotice,
}) => (
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

    <section className="bg-white text-gray-900 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold">Publish Notice With Auto-Reminder</h3>
      <p className="text-sm text-gray-500 mt-1">A reminder message is auto-sent to the selected group before notice end time.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input name="title" value={noticeForm.title} onChange={onNoticeFormChange} placeholder="Notice title" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <select name="target_group" value={noticeForm.target_group} onChange={onNoticeFormChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Select group</option>
          {noticeGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
        <textarea name="content" value={noticeForm.content} onChange={onNoticeFormChange} placeholder="Notice content" rows={3} className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
        <input name="end_time" type="datetime-local" value={noticeForm.end_time} onChange={onNoticeFormChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="remind_before_minutes" type="number" min="1" value={noticeForm.remind_before_minutes} onChange={onNoticeFormChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      {noticePublishState?.message && (
        <p className={`mt-3 text-sm ${noticePublishState.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {noticePublishState.message}
        </p>
      )}
      <button
        onClick={onPublishNotice}
        disabled={isPublishingNotice}
        className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPublishingNotice ? 'Publishing...' : 'Publish Notice'}
      </button>
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

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {isModalOpen && (
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
      )}
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

const TeachersSearch = ({ students = [], conversations = [], noDuesRequests = [], notices = [] }) => {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();

  const indexedRows = useMemo(() => {
    return [
      ...students.map((student) => ({
        id: `student-${student.id}`,
        type: 'students',
        title: student.display_name || student.email || 'Student',
        subtitle: student.email || '',
        meta: student.department || 'Department not set',
      })),
      ...conversations.map((conversation) => ({
        id: `conversation-${conversation.id}`,
        type: 'messages',
        title: conversation.name,
        subtitle: conversation.lastMessage || '',
        meta: conversation.time || '',
      })),
      ...noDuesRequests.map((request) => ({
        id: `no-dues-${request.id}`,
        type: 'no-dues',
        title: request.student_name || request.student_email || 'No-dues request',
        subtitle: request.subject_name || request.subject?.subject_name || 'Subject not set',
        meta: (request.status || 'pending').toUpperCase(),
      })),
      ...notices.map((notice) => ({
        id: `notice-${notice.id}`,
        type: 'notices',
        title: notice.title,
        subtitle: notice.content || '',
        meta: notice.timestamp || '',
      })),
    ];
  }, [students, conversations, noDuesRequests, notices]);

  const filteredRows = indexedRows.filter((row) => {
    if (scope !== 'all' && row.type !== scope) return false;
    if (!normalizedQuery) return true;
    const haystack = `${row.title} ${row.subtitle} ${row.meta}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <header>
        <h3 className="text-xl font-semibold text-gray-900">Search Directory</h3>
        <p className="text-sm text-gray-500">Search students, messages, notices, and no-dues requests.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="md:col-span-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Search by name, email, subject, or keyword"
        />
        <select
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="all">All</option>
          <option value="students">Students</option>
          <option value="messages">Messages</option>
          <option value="no-dues">No-Dues</option>
          <option value="notices">Notices</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{filteredRows.length} result(s)</span>
        {normalizedQuery && <button onClick={() => setQuery('')} className="font-semibold text-gray-700">Clear search</button>}
      </div>

      <div className="border border-gray-200 rounded-xl bg-gray-50 divide-y divide-gray-200 max-h-[30rem] overflow-y-auto">
        {filteredRows.length === 0 ? (
          <p className="p-6 text-sm text-gray-600 text-center">No matching results found.</p>
        ) : (
          filteredRows.map((row) => (
            <article key={row.id} className="p-4 bg-white hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{row.title}</p>
                  {row.subtitle && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{row.subtitle}</p>}
                  {row.meta && <p className="text-xs text-gray-400 mt-2">{row.meta}</p>}
                </div>
                <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                  {row.type.replace('-', ' ')}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

const TeachersNoDues = ({ requests, onDecision, subjects, subjectForm, onSubjectFormChange, onCreateSubject }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900">Add No-Dues Subject</h3>
      <p className="text-sm text-gray-500 mb-3">Create a subject clearance requirement for a specific class/department.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <input name="subject_name" value={subjectForm.subject_name} onChange={onSubjectFormChange} placeholder="Subject name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="department" value={subjectForm.department} onChange={onSubjectFormChange} placeholder="Department (e.g., CSE)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="class_year" value={subjectForm.class_year} onChange={onSubjectFormChange} placeholder="Class year (e.g., 4)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="semester" type="number" value={subjectForm.semester} onChange={onSubjectFormChange} placeholder="Semester" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="description" value={subjectForm.description} onChange={onSubjectFormChange} placeholder="Description" className="rounded-lg border border-gray-300 px-3 py-2 text-sm lg:col-span-2" />
      </div>
      <button onClick={onCreateSubject} className="mt-3 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-black">Add Subject</button>
      {subjects.length > 0 && (
        <div className="mt-4 text-xs text-gray-600">Active subjects: {subjects.map((item) => item.subject_name).join(', ')}</div>
      )}
    </div>

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

const TeachersTimetable = ({ schedule, onAddLecture, onDeleteLecture, onUpdateLecture }) => {
  const [newLecture, setNewLecture] = useState({
    time: '',
    course: '',
    batch: '',
    type: 'Lecture',
    note: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editingLecture, setEditingLecture] = useState({
    time: '',
    course: '',
    batch: '',
    type: '',
    note: '',
  });

  const startEditing = (slot) => {
    setEditingId(slot.id);
    setEditingLecture({
      time: slot.time || '',
      course: slot.course || '',
      batch: slot.batch || '',
      type: slot.type || '',
      note: slot.note || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingLecture({ time: '', course: '', batch: '', type: '', note: '' });
  };

  const handleAdd = () => {
    if (!newLecture.time.trim() || !newLecture.course.trim()) return;
    onAddLecture({
      time: newLecture.time.trim(),
      course: newLecture.course.trim(),
      batch: newLecture.batch.trim(),
      type: newLecture.type.trim() || 'Lecture',
      note: newLecture.note.trim(),
    });
    setNewLecture({ time: '', course: '', batch: '', type: 'Lecture', note: '' });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    if (!editingLecture.time.trim() || !editingLecture.course.trim()) return;
    onUpdateLecture(editingId, {
      time: editingLecture.time.trim(),
      course: editingLecture.course.trim(),
      batch: editingLecture.batch.trim(),
      type: editingLecture.type.trim() || 'Lecture',
      note: editingLecture.note.trim(),
    });
    cancelEditing();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Teaching Schedule</h3>
          <p className="text-sm text-gray-500">Add, edit, delete, and customise lecture slots.</p>
        </div>
      </header>

      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Add Lecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={newLecture.time}
            onChange={(event) => setNewLecture((prev) => ({ ...prev, time: event.target.value }))}
            placeholder="09:00 - 10:00"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={newLecture.course}
            onChange={(event) => setNewLecture((prev) => ({ ...prev, course: event.target.value }))}
            placeholder="Course"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={newLecture.batch}
            onChange={(event) => setNewLecture((prev) => ({ ...prev, batch: event.target.value }))}
            placeholder="Batch / Room"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={newLecture.type}
            onChange={(event) => setNewLecture((prev) => ({ ...prev, type: event.target.value }))}
            placeholder="Type"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={newLecture.note}
            onChange={(event) => setNewLecture((prev) => ({ ...prev, note: event.target.value }))}
            placeholder="Notes"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button onClick={handleAdd} className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition">Add Lecture</button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Time</th>
              <th className="px-4 py-3 text-left font-medium">Course</th>
              <th className="px-4 py-3 text-left font-medium">Batch / Room</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Notes</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((slot) => {
              const isEditing = editingId === slot.id;
              return (
                <tr key={slot.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                    {isEditing ? <input value={editingLecture.time} onChange={(event) => setEditingLecture((prev) => ({ ...prev, time: event.target.value }))} className="rounded border border-gray-300 px-2 py-1 w-full" /> : slot.time}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {isEditing ? <input value={editingLecture.course} onChange={(event) => setEditingLecture((prev) => ({ ...prev, course: event.target.value }))} className="rounded border border-gray-300 px-2 py-1 w-full" /> : slot.course}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? <input value={editingLecture.batch} onChange={(event) => setEditingLecture((prev) => ({ ...prev, batch: event.target.value }))} className="rounded border border-gray-300 px-2 py-1 w-full" /> : slot.batch}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? <input value={editingLecture.type} onChange={(event) => setEditingLecture((prev) => ({ ...prev, type: event.target.value }))} className="rounded border border-gray-300 px-2 py-1 w-full" /> : slot.type}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {isEditing ? <input value={editingLecture.note} onChange={(event) => setEditingLecture((prev) => ({ ...prev, note: event.target.value }))} className="rounded border border-gray-300 px-2 py-1 w-full" /> : slot.note}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {isEditing ? (
                      <>
                        <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-semibold rounded bg-gray-900 text-white hover:bg-black">Save</button>
                        <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(slot)} className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Edit</button>
                        <button onClick={() => onDeleteLecture(slot.id)} className="px-3 py-1.5 text-xs font-semibold rounded border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeachersMstMarks = ({
  students,
  marksForm,
  onMarksFormChange,
  onSubmitMarks,
  isSubmitting,
  submitState,
  bulkFileName,
  bulkPreview,
  bulkState,
  bulkFailedRows,
  isBulkSubmitting,
  onBulkFileChange,
  onDownloadTemplate,
  onSubmitBulkMarks,
}) => (
  <div className="space-y-6">
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900">Enter MST Marks</h3>
      <p className="text-sm text-gray-500 mt-1">Faculty can submit student MST marks out of 20. Students can view them in their dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <select name="student_id" value={marksForm.student_id} onChange={onMarksFormChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.display_name} ({student.email})</option>
          ))}
        </select>
        <input name="subject" value={marksForm.subject} onChange={onMarksFormChange} placeholder="Subject (e.g., Mathematics)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="semester" value={marksForm.semester} onChange={onMarksFormChange} placeholder="Semester (e.g., Sem 4)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="marks" type="number" min="0" max="20" step="0.5" value={marksForm.marks} onChange={onMarksFormChange} placeholder="Marks out of 20" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      {submitState?.message && (
        <p className={`mt-3 text-sm ${submitState.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{submitState.message}</p>
      )}

      <button onClick={onSubmitMarks} disabled={isSubmitting} className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed">
        {isSubmitting ? 'Submitting...' : 'Submit MST Marks'}
      </button>
    </section>

    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Bulk Upload via CSV</h3>
      <p className="text-sm text-gray-500 mt-1">Upload a CSV with headers: student_id,subject,semester,marks. Optional: max_marks (defaults to 20).</p>

      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
        <button onClick={onDownloadTemplate} className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Download CSV Template
        </button>
        <input type="file" accept=".csv" onChange={onBulkFileChange} className="text-sm" />
        <span className="text-xs text-gray-500">{bulkFileName || 'No file selected'}</span>
      </div>

      {bulkState?.message && (
        <p className={`mt-3 text-sm ${bulkState.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{bulkState.message}</p>
      )}

      {bulkPreview.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student ID</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Semester</th>
                <th className="px-4 py-3 text-left font-medium">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {bulkPreview.slice(0, 8).map((row, idx) => (
                <tr key={`preview-${idx}`}>
                  <td className="px-4 py-3">{row.student_id}</td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="px-4 py-3">{row.semester}</td>
                  <td className="px-4 py-3">{row.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {bulkPreview.length > 8 && <p className="px-4 py-2 text-xs text-gray-500">Showing first 8 rows of {bulkPreview.length} parsed rows.</p>}
        </div>
      )}

      <button onClick={onSubmitBulkMarks} disabled={isBulkSubmitting || bulkPreview.length === 0} className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed">
        {isBulkSubmitting ? 'Uploading...' : 'Upload Bulk Marks'}
      </button>

      {bulkFailedRows.length > 0 && (
        <div className="mt-4 border border-red-200 rounded-xl overflow-x-auto">
          <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-semibold text-red-700">
            Failed Rows ({bulkFailedRows.length})
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-red-50/60 text-red-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Row</th>
                <th className="px-4 py-3 text-left font-medium">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100 text-red-700">
              {bulkFailedRows.map((row, idx) => (
                <tr key={`failed-${idx}`}>
                  <td className="px-4 py-3">{row.row}</td>
                  <td className="px-4 py-3">{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-900">Students Available</h4>
      <p className="text-sm text-gray-500 mt-1">{students.length} students loaded for quick marks entry.</p>
      <div className="mt-4 max-h-72 overflow-y-auto border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {students.map((student) => (
              <tr key={`student-${student.id}`}>
                <td className="px-4 py-3">{student.display_name}</td>
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">{student.department || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

const TeachersProfileCard = ({ user, availability, onToggleAvailability, onLogout }) => (
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
    <button
      onClick={onLogout}
      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded-xl transition"
    >
      <LogoutIcon className="w-4 h-4" />
      Logout
    </button>
  </div>
);

const navItems = [
  { key: "Home", icon: HomeIcon },
  { key: "Messages", icon: MessageIcon },
  { key: "Attendance", icon: AttendanceIcon },
  { key: "Availability", icon: CalendarIcon },
  { key: "MST Marks", icon: ClipboardIcon },
  { key: "Search", icon: SearchIcon },
  { key: "Calendar", icon: CalendarIcon },
  { key: "No-Dues", icon: ClipboardIcon },
  { key: "Timetable", icon: CalendarIcon },
  { key: "Settings", icon: SettingsIcon },
];

const FacultySettingsPage = ({ user }) => {
  const settingsKey = `campusmate_settings_${user?.role || 'faculty'}`;
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(settingsKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed to parse faculty settings', err);
    }
    return {
      emailNotifications: true,
      reminderAlerts: true,
      autoOpenNoDues: false,
      officeStatusVisible: true,
    };
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    setSaved(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-3xl space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Faculty Settings</h3>
      <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
        <span className="text-sm font-medium text-gray-700">Email notifications</span>
        <input type="checkbox" checked={settings.emailNotifications} onChange={() => toggle('emailNotifications')} className="h-5 w-5" />
      </label>
      <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
        <span className="text-sm font-medium text-gray-700">Reminder alerts</span>
        <input type="checkbox" checked={settings.reminderAlerts} onChange={() => toggle('reminderAlerts')} className="h-5 w-5" />
      </label>
      <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
        <span className="text-sm font-medium text-gray-700">Auto-open no-dues panel on login</span>
        <input type="checkbox" checked={settings.autoOpenNoDues} onChange={() => toggle('autoOpenNoDues')} className="h-5 w-5" />
      </label>
      <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
        <span className="text-sm font-medium text-gray-700">Show office availability to students</span>
        <input type="checkbox" checked={settings.officeStatusVisible} onChange={() => toggle('officeStatusVisible')} className="h-5 w-5" />
      </label>
      <div className="flex items-center gap-3">
        <button onClick={saveSettings} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black">Save settings</button>
        {saved && <span className="text-sm text-green-600">Saved successfully.</span>}
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [calendarCursor, setCalendarCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarForm, setCalendarForm] = useState({ title: "", date: "", branch: "", year: "", time: "10:00", details: "" });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState({});
  const [noDuesRequests, setNoDuesRequests] = useState([]);
  const [noDuesSubjects, setNoDuesSubjects] = useState([]);
  const [subjectForm, setSubjectForm] = useState({ subject_name: '', department: '', class_year: '', semester: '', description: '' });
  const [facultyNotices, setFacultyNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', target_group: '', end_time: '', remind_before_minutes: '30' });
  const [isPublishingNotice, setIsPublishingNotice] = useState(false);
  const [noticePublishState, setNoticePublishState] = useState({ type: '', message: '' });
  const [students, setStudents] = useState([]);
  const [isSubmittingMarks, setIsSubmittingMarks] = useState(false);
  const [marksSubmitState, setMarksSubmitState] = useState({ type: '', message: '' });
  const [marksForm, setMarksForm] = useState({ student_id: '', subject: '', semester: '', marks: '' });
  const [bulkMarksRows, setBulkMarksRows] = useState([]);
  const [bulkFailedRows, setBulkFailedRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkState, setBulkState] = useState({ type: '', message: '' });
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "Hackathon Briefing", date: "2026-02-02", time: "17:00", branch: "CSE", year: "3", description: "Orientation for Smart Campus Hackathon" },
    { id: 2, title: "Industry Talk", date: "2026-02-05", time: "11:00", branch: "ECE", year: "4", description: "AI in Communication Systems" },
    { id: 3, title: "Mid-term Review", date: "2026-02-12", time: "14:00", branch: "CSE", year: "4", description: "Project milestone evaluation" }
  ]);
  const [timetable, setTimetable] = useState(() => {
    try {
      const stored = localStorage.getItem('faculty_timetable_slots');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse stored timetable', err);
    }

    return [
      { id: 1, time: "09:00 - 10:00", course: "AI Foundations", batch: "CSE 6th Sem • Room 304", type: "Lecture", note: "Lab on Thursday" },
      { id: 2, time: "10:15 - 11:15", course: "Project Mentorship", batch: "Capstone Group A", type: "Mentoring", note: "Prototype review" },
      { id: 3, time: "12:00 - 13:00", course: "Faculty Council", batch: "Staff Room", type: "Meeting", note: "Academic planning" },
      { id: 4, time: "14:00 - 16:00", course: "AI Lab", batch: "CSE 6th Sem • Lab 2", type: "Practical", note: "Neural nets hands-on" }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('faculty_timetable_slots', JSON.stringify(timetable));
    } catch (err) {
      console.warn('Failed to store timetable', err);
    }
  }, [timetable]);

  const handleAddLecture = (lecture) => {
    setTimetable((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...lecture,
      },
    ]);
  };

  const handleDeleteLecture = (lectureId) => {
    setTimetable((prev) => prev.filter((slot) => slot.id !== lectureId));
  };

  const handleUpdateLecture = (lectureId, updatedLecture) => {
    setTimetable((prev) =>
      prev.map((slot) => (slot.id === lectureId ? { ...slot, ...updatedLecture } : slot))
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("accessToken");
        const storedRole = localStorage.getItem("user_role");
        
        // Validate that the stored role is "faculty" for this dashboard
        if (storedRole && storedRole !== "faculty") {
          // Wrong user type logged in, redirect to correct dashboard
          if (storedRole === "student") {
            navigate("/dashboard");
          } else if (storedRole === "admin") {
            navigate("/dashboard");
          }
          return;
        }
        
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
          
          // Double-check the role from API matches expectations
          if (data.role && data.role !== "faculty") {
            navigate("/dashboard");
            return;
          }
          
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
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getFacultyStudents();
        setStudents(response.data || []);
      } catch (error) {
        console.warn('Failed to load students for MST marks entry', error);
      }
    };
    fetchStudents();
  }, []);

  const handleMarksFormChange = (event) => {
    const { name, value } = event.target;
    setMarksSubmitState({ type: '', message: '' });
    setMarksForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMstMarks = async () => {
    if (!marksForm.student_id || !marksForm.subject || !marksForm.semester || marksForm.marks === '') {
      setMarksSubmitState({ type: 'error', message: 'Please fill student, subject, semester, and marks.' });
      return;
    }

    setIsSubmittingMarks(true);
    try {
      await enterStudentMarks({
        student_id: Number(marksForm.student_id),
        subject: marksForm.subject,
        semester: marksForm.semester,
        marks: Number(marksForm.marks),
        max_marks: 20,
      });
      setMarksSubmitState({ type: 'success', message: 'MST marks submitted successfully.' });
      setMarksForm((prev) => ({ ...prev, subject: '', marks: '' }));
    } catch (error) {
      const apiError = error?.response?.data?.error || 'Failed to submit marks.';
      setMarksSubmitState({ type: 'error', message: apiError });
    } finally {
      setIsSubmittingMarks(false);
    }
  };

  const handleBulkFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBulkFileName(file.name);
    setBulkState({ type: '', message: '' });
    setBulkFailedRows([]);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (lines.length < 2) {
        setBulkMarksRows([]);
        setBulkFailedRows([]);
        setBulkState({ type: 'error', message: 'CSV must include header and at least one data row.' });
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const required = ['student_id', 'subject', 'semester', 'marks'];
      const missing = required.filter((key) => !headers.includes(key));
      if (missing.length > 0) {
        setBulkMarksRows([]);
        setBulkFailedRows([]);
        setBulkState({ type: 'error', message: `Missing required CSV headers: ${missing.join(', ')}` });
        return;
      }

      const indexOf = (key) => headers.indexOf(key);
      const parsedRows = [];
      for (let i = 1; i < lines.length; i += 1) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const row = {
          student_id: Number(cols[indexOf('student_id')]),
          subject: cols[indexOf('subject')] || '',
          semester: cols[indexOf('semester')] || '',
          marks: Number(cols[indexOf('marks')]),
          max_marks: headers.includes('max_marks') ? Number(cols[indexOf('max_marks')] || 20) : 20,
        };
        if (!row.student_id || !row.subject || !row.semester || Number.isNaN(row.marks)) {
          continue;
        }
        parsedRows.push(row);
      }

      setBulkMarksRows(parsedRows);
      setBulkFailedRows([]);
      setBulkState({ type: 'success', message: `Parsed ${parsedRows.length} rows from CSV.` });
    } catch (error) {
      setBulkMarksRows([]);
      setBulkFailedRows([]);
      setBulkState({ type: 'error', message: 'Unable to parse CSV file.' });
    }
  };

  const handleDownloadBulkTemplate = () => {
    const template = [
      'student_id,subject,semester,marks,max_marks',
      '5,Mathematics,Sem 4,13,20',
      '12,Physics,Sem 4,16.5,20',
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mst_marks_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmitBulkMarks = async () => {
    if (bulkMarksRows.length === 0) {
      setBulkState({ type: 'error', message: 'Please upload a valid CSV first.' });
      return;
    }

    setIsBulkSubmitting(true);
    try {
      const response = await bulkEnterStudentMarks(bulkMarksRows);
      const data = response.data || {};
      const failedCount = Array.isArray(data.failed) ? data.failed.length : 0;
      setBulkFailedRows(Array.isArray(data.failed) ? data.failed : []);
      setBulkState({
        type: failedCount ? 'error' : 'success',
        message: `Bulk upload complete. Created: ${data.created || 0}, Updated: ${data.updated || 0}, Failed: ${failedCount}.`,
      });
    } catch (error) {
      setBulkFailedRows([]);
      const apiError = error?.response?.data?.error || 'Bulk upload failed.';
      setBulkState({ type: 'error', message: apiError });
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication tokens and user data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_department');
    
    // Redirect to login page
    navigate('/faculty/login');
  };

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

  const refreshNoDuesData = async () => {
    try {
      const [subjectsRes, applicationsRes] = await Promise.all([
        getNoDuesSubjects(),
        getNoDuesApplications(),
      ]);

      setNoDuesSubjects(subjectsRes.data || []);

      const normalizedRequests = (applicationsRes.data || []).map((app) => ({
        id: app.id,
        name: app.student_name || app.student?.email || 'Student',
        roll: app.student || '-',
        branch: app.subject?.department || '-',
        year: app.subject?.class_year ? `${app.subject.class_year}th` : '-',
        subject: app.subject?.subject_name || '-',
        status: app.status === 'PENDING' ? 'Pending' : app.status === 'APPROVED' ? 'Approved' : 'Declined',
        remark: app.remark || '',
      }));
      setNoDuesRequests(normalizedRequests);
    } catch (err) {
      console.warn('No-dues data fetch failed', err);
    }
  };

  const refreshNotices = async () => {
    try {
      const res = await getFacultyNotices();
      const rows = res.data || [];
      setFacultyNotices(rows);
    } catch (err) {
      console.warn('Faculty notices fetch failed', err);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    refreshNoDuesData();
    refreshNotices();
  }, [user]);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  const notices = useMemo(
    () => facultyNotices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      timestamp: notice.end_time ? `Ends ${new Date(notice.end_time).toLocaleString()}` : new Date(notice.created_at).toLocaleString(),
      category: notice.target_audience || 'all',
    })),
    [facultyNotices]
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
    const mappedStatus = status === 'Approved' ? 'APPROVED' : status === 'Declined' ? 'REJECTED' : 'PENDING';
    reviewNoDuesApplication(id, { status: mappedStatus, remark })
      .then(() => refreshNoDuesData())
      .catch((err) => console.warn('No-dues review failed', err));
  };

  const handleSubjectFormChange = (event) => {
    const { name, value } = event.target;
    setSubjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubject = async () => {
    if (!subjectForm.subject_name || !subjectForm.department) {
      return;
    }

    try {
      await createNoDuesSubject({
        subject_name: subjectForm.subject_name,
        department: subjectForm.department,
        class_year: subjectForm.class_year || null,
        semester: subjectForm.semester ? Number(subjectForm.semester) : null,
        description: subjectForm.description,
      });
      setSubjectForm({ subject_name: '', department: '', class_year: '', semester: '', description: '' });
      refreshNoDuesData();
    } catch (err) {
      console.warn('No-dues subject creation failed', err);
    }
  };

  const handleNoticeFormChange = (event) => {
    const { name, value } = event.target;
    setNoticeForm((prev) => ({ ...prev, [name]: value }));
    if (noticePublishState.message) {
      setNoticePublishState({ type: '', message: '' });
    }
  };

  const handlePublishNotice = async () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      setNoticePublishState({ type: 'error', message: 'Title and content are required.' });
      return;
    }

    if (!noticeForm.target_group) {
      setNoticePublishState({ type: 'error', message: 'Please select a target chat group.' });
      return;
    }

    if (!noticeForm.end_time) {
      setNoticePublishState({ type: 'error', message: 'Please choose an end time for auto-reminder.' });
      return;
    }

    const remindBefore = Number(noticeForm.remind_before_minutes || 30);
    if (!Number.isFinite(remindBefore) || remindBefore < 1) {
      setNoticePublishState({ type: 'error', message: 'Reminder minutes must be at least 1.' });
      return;
    }

    try {
      setIsPublishingNotice(true);
      setNoticePublishState({ type: '', message: '' });

      // datetime-local returns local wall time; convert to ISO for DRF DateTimeField.
      const endTimeIso = new Date(noticeForm.end_time).toISOString();

      await createFacultyNotice({
        title: noticeForm.title.trim(),
        content: noticeForm.content.trim(),
        target_audience: 'student',
        target_group: Number(noticeForm.target_group),
        end_time: endTimeIso,
        remind_before_minutes: remindBefore,
      });
      setNoticeForm({ title: '', content: '', target_group: '', end_time: '', remind_before_minutes: '30' });
      await refreshNotices();
      setNoticePublishState({ type: 'success', message: 'Notice published successfully.' });
    } catch (err) {
      console.warn('Notice publish failed', err);
      const fieldErrors = err?.response?.data && typeof err.response.data === 'object'
        ? Object.entries(err.response.data)
            .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join(' | ')
        : '';
      const serverMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        fieldErrors ||
        (typeof err?.response?.data === 'string' ? err.response.data : '') ||
        'Failed to publish notice. Please check your fields and try again.';
      setNoticePublishState({ type: 'error', message: serverMessage });
    } finally {
      setIsPublishingNotice(false);
    }
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
        return (
          <TeachersHome
            notices={notices}
            events={events}
            insights={insights}
            noticeForm={noticeForm}
            onNoticeFormChange={handleNoticeFormChange}
            onPublishNotice={handlePublishNotice}
            noticeGroups={conversations}
            noticePublishState={noticePublishState}
            isPublishingNotice={isPublishingNotice}
          />
        );
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
      case "Attendance":
        return <AttendancePage />;
      case "Availability":
        return <FacultyAvailabilityPage mode="faculty" />;
      case "MST Marks":
        return (
          <TeachersMstMarks
            students={students}
            marksForm={marksForm}
            onMarksFormChange={handleMarksFormChange}
            onSubmitMarks={handleSubmitMstMarks}
            isSubmitting={isSubmittingMarks}
            submitState={marksSubmitState}
            bulkFileName={bulkFileName}
            bulkPreview={bulkMarksRows}
            bulkState={bulkState}
            bulkFailedRows={bulkFailedRows}
            isBulkSubmitting={isBulkSubmitting}
            onBulkFileChange={handleBulkFileChange}
            onDownloadTemplate={handleDownloadBulkTemplate}
            onSubmitBulkMarks={handleSubmitBulkMarks}
          />
        );
      case "Search":
        return (
          <TeachersSearch
            students={students}
            conversations={conversations}
            noDuesRequests={noDuesRequests}
            notices={notices}
          />
        );
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
        return (
          <TeachersNoDues
            requests={noDuesRequests}
            onDecision={handleNoDuesDecision}
            subjects={noDuesSubjects}
            subjectForm={subjectForm}
            onSubjectFormChange={handleSubjectFormChange}
            onCreateSubject={handleCreateSubject}
          />
        );
      case "Timetable":
        return (
          <TeachersTimetable
            schedule={timetable}
            onAddLecture={handleAddLecture}
            onDeleteLecture={handleDeleteLecture}
            onUpdateLecture={handleUpdateLecture}
          />
        );
      case "Settings":
        return <FacultySettingsPage user={user} />;
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
                onLogout={handleLogout}
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
