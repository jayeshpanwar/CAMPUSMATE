import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { getProfile, getChatGroups, getGroupMessages, getNoDuesSubjects, getNoDuesApplications, applyNoDues, getMyMarks } from "./api";
import SharedMessagesPage from './SharedMessagesPage';

// --- Icon Components ---
const HomeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const MessageSquareIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const CalendarIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const SettingsIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const MenuIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
const PlusIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const ChevronLeftIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const SendIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const ClipboardIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);
// --- No-Dues Specific Icons ---
const FileTextIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);
const CheckCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const ClockIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const SparklesNavIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>
);

const hackathonShowcase = [
    {
        id: 'hackathon-1',
        title: 'HackWave 2026',
        description: 'Team up for a 48-hour build focused on sustainable AI solutions. Mentors from Google and Infosys will be available.',
        deadline: 'Feb 10, 2026',
        status: 'Registration open',
    },
    {
        id: 'hackathon-2',
        title: 'FinSprint Challenge',
        description: 'Design a fintech MVP to improve campus micro-payments. Final demos happen during TechFest weekend.',
        deadline: 'Mar 02, 2026',
        status: 'Shortlisting teams',
    },
    {
        id: 'hackathon-3',
        title: 'Smart Campus Buildathon',
        description: 'IoT-centered challenge in collaboration with the ECE department. Hardware kits provided.',
        deadline: 'Mar 15, 2026',
        status: 'Early bird slots',
    },
];

const eventShowcase = [
    {
        id: 'event-1',
        title: 'Guest Lecture · Ethics in GenAI',
        description: 'Dr. A. Mehta (IISc) shares design frameworks for responsible AI deployments in industry.',
        date: 'Jan 29, 2026 • 4:00 PM',
        location: 'Seminar Hall 3',
    },
    {
        id: 'event-2',
        title: 'Product Crash Course',
        description: 'Weekend bootcamp on product thinking led by alumni from Razorpay. Limited seats, register early.',
        date: 'Feb 01, 2026 • 10:30 AM',
        location: 'Innovation Lab',
    },
    {
        id: 'event-3',
        title: 'Cultural Night: Symphony 2026',
        description: 'Annual cultural showcase featuring student clubs, open mic, and food stalls.',
        date: 'Feb 08, 2026 • 6:00 PM',
        location: 'Open Air Theatre',
    },
];

const quickLinksSeed = [
    {
        title: 'Academic Calendar',
        href: 'https://intranet.campusmate.edu/academics/calendar',
        description: 'Important semester milestones, exam windows, and holidays.',
    },
    {
        title: 'Placement Portal',
        href: 'https://placements.campusmate.edu',
        description: 'Company announcements, aptitude resources, and resume formats.',
    },
    {
        title: 'Counselling Support',
        href: 'https://wellbeing.campusmate.edu',
        description: 'Book appointments with student counsellors or register for workshops.',
    },
    {
        title: 'Library Slot Booking',
        href: 'https://library.campusmate.edu/bookings',
        description: 'Reserve discussion rooms, renew books, or request research papers.',
    },
];

const fallbackNoticeFeed = [
    {
        id: 'notice-1',
        title: 'Mid-Semester Exam Schedule Released',
        content: 'Download the official timetable from the examination portal. Attendance is mandatory for lab practicals.',
        posted: 'Jan 24',
        timeLabel: '09:00 AM',
    },
    {
        id: 'notice-2',
        title: 'Library Open Till Midnight',
        content: 'Extended hours this week for project submissions. Carry your ID card to access after 8 PM.',
        posted: 'Jan 23',
        timeLabel: '05:15 PM',
    },
    {
        id: 'notice-3',
        title: 'Scholarship Renewal Reminder',
        content: 'Submit the renewal form and transcript to the scholarships cell by 31 Jan to avoid interruptions.',
        posted: 'Jan 22',
        timeLabel: '11:30 AM',
    },
];

const teacherTaskFeed = [
    {
        id: 'faculty-1',
        title: 'Submit Project Abstract',
        description: 'Upload a one-page summary of your final year project idea on or before the deadline.',
        dueDate: 'Jan 31, 2026',
        course: 'Capstone Project',
        assignedBy: 'Prof. Rao',
    },
    {
        id: 'faculty-2',
        title: 'Weekly Lab Journal',
        description: 'Update your lab journal with experiment results and reflections for Week 3.',
        dueDate: 'Feb 02, 2026',
        course: 'Embedded Systems Lab',
        assignedBy: 'Dr. Banerjee',
    },
    {
        id: 'faculty-3',
        title: 'Peer Review Feedback',
        description: 'Review a teammate’s design document and share constructive feedback in the forum.',
        dueDate: 'Feb 05, 2026',
        course: 'Software Engineering',
        assignedBy: 'Ms. Fernandes',
    },
];

// --- Page Components ---

const DashboardPage = ({
    user,
    notices = [],
    hackathons = [],
    events = [],
    importantLinks = [],
    handleGenerateStudyPlan,
    isGeneratingPlan,
}) => (
    <div className="space-y-8">
        <section className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="uppercase tracking-wide text-indigo-100 text-xs font-semibold">Campus Overview</p>
                    <h2 className="text-3xl font-bold mt-2">Welcome back, {user?.name || 'Student'}!</h2>
                    <p className="text-indigo-100 mt-3 max-w-xl">Stay on top of important notices, competitive opportunities, and upcoming events curated for your batch.</p>
                    {handleGenerateStudyPlan && (
                        <button
                            onClick={handleGenerateStudyPlan}
                            disabled={isGeneratingPlan}
                            className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingPlan ? 'Generating plan…' : '✨ Generate personalized study plan'}
                        </button>
                    )}
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md w-full lg:w-80">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Today&apos;s Snapshot</h3>
                    <ul className="mt-4 space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-indigo-100">Latest notice</span><span className="font-semibold">{notices[0]?.posted || 'No updates'}</span></li>
                        <li className="flex justify-between"><span className="text-indigo-100">Hackathon deadlines</span><span className="font-semibold">{hackathons.length}</span></li>
                        <li className="flex justify-between"><span className="text-indigo-100">Events this week</span><span className="font-semibold">{events.length}</span></li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <article className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <header className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Important Notices</h3>
                        <p className="text-sm text-gray-500">Campus announcements targeted for you</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">{notices.length} updates</span>
                </header>
                <div className="space-y-4">
                    {notices.length === 0 ? (
                        <p className="text-sm text-gray-500">No new notices right now. Check back soon.</p>
                    ) : (
                        notices.slice(0, 4).map((notice) => (
                            <div key={notice.id} className="border border-indigo-50 rounded-xl p-4 hover:border-indigo-200 transition">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                                    <span className="text-xs text-gray-400">{notice.posted || notice.timeLabel}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{notice.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </article>

            <article className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <header className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Hackathons & Challenges</h3>
                        <p className="text-sm text-gray-500">Compete, collaborate, and innovate</p>
                    </div>
                    <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">{hackathons.length} open</span>
                </header>
                <div className="space-y-4">
                    {hackathons.length === 0 ? (
                        <p className="text-sm text-gray-500">No active hackathons. Keep an eye out!</p>
                    ) : (
                        hackathons.slice(0, 4).map((item) => (
                            <div key={item.id} className="border border-green-50 rounded-xl p-4 hover:border-green-200 transition">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                    <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">{item.status || 'Open'}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                <p className="text-xs text-gray-400 mt-2">Deadline: {item.deadline}</p>
                            </div>
                        ))
                    )}
                </div>
            </article>

            <article className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <header className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Upcoming Events</h3>
                        <p className="text-sm text-gray-500">Workshops, seminars, and campus life</p>
                    </div>
                    <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">{events.length} scheduled</span>
                </header>
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <p className="text-sm text-gray-500">No events have been planned yet.</p>
                    ) : (
                        events.slice(0, 4).map((event) => (
                            <div key={event.id} className="border border-purple-50 rounded-xl p-4 hover:border-purple-200 transition">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                    <span className="text-xs text-purple-500">{event.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                                <p className="text-xs text-gray-400 mt-2">Venue: {event.location}</p>
                            </div>
                        ))
                    )}
                </div>
            </article>
        </section>

        {importantLinks.length > 0 && (
            <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <header className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Quick Links</h3>
                    <span className="text-xs text-gray-400">Resources for a smooth semester</span>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {importantLinks.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition flex flex-col"
                        >
                            <span className="text-sm font-semibold text-gray-800">{link.title}</span>
                            <span className="mt-2 text-xs text-gray-500 flex-1">{link.description}</span>
                            <span className="mt-4 text-xs font-semibold text-indigo-600">Open →</span>
                        </a>
                    ))}
                </div>
            </section>
        )}
    </div>
);

const MessagesPage = SharedMessagesPage;

const NewConversationModal = ({ onClose, onStartConversation, allUsers, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.name !== currentUser.name);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col h-[60vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0"><h3 className="text-xl font-bold">New Conversation</h3><button onClick={onClose}><XIcon className="w-6 h-6 text-gray-500" /></button></div>
                 <div className="flex-shrink-0"><input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for users..." className="w-full border border-gray-300 rounded-md shadow-sm p-2" /></div>
                <div className="mt-4 flex-1 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <li key={user.name} onClick={() => onStartConversation(user)} className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">{user.initials}</div>
                                    <div><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-500">{user.role}</p></div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-gray-500 mt-8">No users found.</p>}
                </div>
            </div>
        </div>
    );
};

const CalendarPage = ({ handleGenerateDaySummary, isGeneratingSummary }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', time: '10:00', type: 'event', details: '' });
    const [events, setEvents] = useState(() => {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        return [
            { date: new Date(year, month, 15).toISOString().split('T')[0], time: '10:00', title: 'Major Presentation', details: 'Presentation at room 208', type: 'important' },
            { date: new Date(year, month, 20).toISOString().split('T')[0], time: '18:00', title: 'HackWave Hackathon', details: 'Registration for hackathon', type: 'hackathon' },
            { date: new Date(year, month, 23).toISOString().split('T')[0], time: '14:00', title: 'Team Meeting', details: 'Discuss project milestones', type: 'event' },
             { date: new Date(year, month, 23).toISOString().split('T')[0], time: '16:00', title: 'Submit Assignment', details: 'Physics Assignment due', type: 'important' },
        ]
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleDateClick = (day) => { setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)); };
    const handleSaveEvent = (e) => {
        e.preventDefault();
        setEvents([...events, { ...newEvent, date: selectedDate.toISOString().split('T')[0] }]);
        setIsEventModalOpen(false);
        setNewEvent({ title: '', time: '10:00', type: 'event', details: '' });
    };

    const selectedDateEvents = events.filter(event => new Date(event.date + 'T00:00:00').toDateString() === selectedDate.toDateString());

    const EventModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add Event for {selectedDate.toLocaleDateString()}</h3><button onClick={() => setIsEventModalOpen(false)}><XIcon className="w-6 h-6 text-gray-500" /></button></div>
                <form onSubmit={handleSaveEvent}>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700">Title</label><input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Time</label><input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Details</label><textarea value={newEvent.details} onChange={e => setNewEvent({...newEvent, details: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea></div>
                        <div><label className="block text-sm font-medium text-gray-700">Type</label><select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"><option value="event">Event</option><option value="important">Important</option><option value="hackathon">Hackathon</option></select></div>
                    </div>
                    <div className="mt-6 flex justify-end"><button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Save Event</button></div>
                </form>
            </div>
        </div>
    );
    
    const eventTypeClasses = { important: { border: 'border-purple-500', bg: 'bg-purple-50', dot: 'bg-purple-500' }, hackathon: { border: 'border-green-500', bg: 'bg-green-50', dot: 'bg-green-500' }, event: { border: 'border-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500' }, };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {isEventModalOpen && <EventModal />}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4"><button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button><h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2><button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button></div>
                <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">{daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}</div>
                <div className="grid grid-cols-7">
                    {Array(firstDayOfMonth).fill(null).map((_, index) => <div key={`empty-${index}`} className="border h-24"></div>)}
                    {Array(daysInMonth).fill(null).map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isSelected = selectedDate.toDateString() === dayDate.toDateString();
                        const dayEvents = events.filter(e => new Date(e.date + 'T00:00:00').toDateString() === dayDate.toDateString());
                        return (
                             <div key={day} onClick={() => handleDateClick(day)} className={`border p-2 h-24 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}>
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : ''}`}>{day}</span>
                                <div className="flex justify-center space-x-1 mt-1">{dayEvents.slice(0, 3).map((e, i) => <div key={i} className={`w-2 h-2 rounded-full ${eventTypeClasses[e.type]?.dot}`}></div>)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-800">Events for {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}</h3><button onClick={() => setIsEventModalOpen(true)} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"><PlusIcon className="w-5 h-5" /></button></div>
                <div className="space-y-4 h-80 overflow-y-auto pr-2">
                    {selectedDateEvents.length > 0 ? selectedDateEvents.sort((a,b) => a.time.localeCompare(b.time)).map((event, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${eventTypeClasses[event.type]?.border} ${eventTypeClasses[event.type]?.bg}`}><p className="text-sm text-gray-500">{new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><p className="font-bold text-gray-800">{event.title}</p><p className="text-sm text-gray-600">{event.details}</p></div>
                    )) : <p className="text-gray-500 text-center mt-10">No events for this day.</p>}
                </div>
                {selectedDateEvents.length > 0 && (
                    <div className="mt-4">
                        <button onClick={() => handleGenerateDaySummary(selectedDateEvents, selectedDate)} disabled={isGeneratingSummary} className="w-full text-left bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold p-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isGeneratingSummary ? 'Summarizing...' : '✨ Summarize Day'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TasksPage = ({
    teacherTasks = [],
    studentTasks = [],
    onAddStudentTask,
    onToggleStudentTask,
    onDeleteStudentTask,
    completedTeacherTaskIds = [],
    onToggleTeacherTask,
    onClearCompletedStudentTasks,
}) => {
    const [studentFilter, setStudentFilter] = useState('pending');
    const [teacherFilter, setTeacherFilter] = useState('pending');
    const [newTask, setNewTask] = useState({ title: '', dueDate: '', notes: '' });
    const [formError, setFormError] = useState('');

    const completedTeacherTaskSet = new Set(completedTeacherTaskIds);

    const studentSummary = {
        total: studentTasks.length,
        pending: studentTasks.filter((task) => !task.completed).length,
        completed: studentTasks.filter((task) => task.completed).length,
    };
    const studentProgress = studentSummary.total ? Math.round((studentSummary.completed / studentSummary.total) * 100) : 0;

    const teacherCompletedCount = teacherTasks.reduce(
        (count, task) => count + (completedTeacherTaskSet.has(task.id) ? 1 : 0),
        0,
    );
    const teacherSummary = {
        total: teacherTasks.length,
        pending: Math.max(teacherTasks.length - teacherCompletedCount, 0),
        completed: teacherCompletedCount,
    };
    const teacherProgress = teacherSummary.total ? Math.round((teacherSummary.completed / teacherSummary.total) * 100) : 0;

    const parseDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return date;
    };

    const formatDueDate = (value) => {
        if (!value) return 'No due date';
        const parsed = parseDate(value);
        if (!parsed) return value;
        return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const sortStudentTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            const aDate = parseDate(a.dueDate);
            const bDate = parseDate(b.dueDate);
            if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
                return aDate - bDate;
            }
            if (aDate && !bDate) return -1;
            if (!aDate && bDate) return 1;
            const aCreated = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const bCreated = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return bCreated - aCreated;
        });
    };

    const filterTasks = (tasks, filter) => {
        switch (filter) {
            case 'pending':
                return tasks.filter((task) => !task.completed);
            case 'completed':
                return tasks.filter((task) => task.completed);
            default:
                return tasks;
        }
    };

    const sortedStudentTasks = sortStudentTasks(studentTasks);
    const studentDisplayList = filterTasks(sortedStudentTasks, studentFilter);

    const decoratedTeacherTasks = teacherTasks.map((task) => ({
        ...task,
        completed: completedTeacherTaskSet.has(task.id),
    }));
    const sortedTeacherTasks = [...decoratedTeacherTasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return a.title.localeCompare(b.title);
    });
    const teacherDisplayList = filterTasks(sortedTeacherTasks, teacherFilter);

    const resetForm = () => {
        setNewTask({ title: '', dueDate: '', notes: '' });
        setFormError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedTitle = newTask.title.trim();
        if (!trimmedTitle) {
            setFormError('Add a title before saving your task.');
            return;
        }
        onAddStudentTask?.({
            title: trimmedTitle,
            dueDate: newTask.dueDate,
            notes: newTask.notes.trim(),
        });
        setStudentFilter('pending');
        resetForm();
    };

    const filterOptions = [
        { id: 'pending', label: 'Pending' },
        { id: 'all', label: 'All' },
        { id: 'completed', label: 'Completed' },
    ];

    return (
        <div className="space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">My Tasks</h3>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{studentSummary.pending} pending</p>
                            <p className="text-sm text-gray-500">Completed {studentSummary.completed} of {studentSummary.total}</p>
                        </div>
                        <span className="text-lg font-semibold text-gray-400">{studentProgress}%</span>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${studentProgress}%` }} />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Faculty Tasks</h3>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{teacherSummary.pending} pending</p>
                            <p className="text-sm text-gray-500">Completed {teacherSummary.completed} of {teacherSummary.total}</p>
                        </div>
                        <span className="text-lg font-semibold text-gray-400">{teacherProgress}%</span>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all" style={{ width: `${teacherProgress}%` }} />
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My To-dos</h2>
                        <p className="text-sm text-gray-500">Everything you add stays private to you.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="inline-flex bg-gray-100 rounded-full p-1">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setStudentFilter(option.id)}
                                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
                                        studentFilter === option.id
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {studentSummary.completed > 0 && onClearCompletedStudentTasks && (
                            <button
                                type="button"
                                onClick={onClearCompletedStudentTasks}
                                className="text-sm font-semibold text-red-500 hover:text-red-600"
                            >
                                Clear completed
                            </button>
                        )}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Task title</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(event) => setNewTask((prev) => ({ ...prev, title: event.target.value }))}
                                placeholder="e.g. Draft internship mail"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Due date</label>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(event) => setNewTask((prev) => ({ ...prev, dueDate: event.target.value }))}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Notes (optional)</label>
                            <textarea
                                rows={1}
                                value={newTask.notes}
                                onChange={(event) => setNewTask((prev) => ({ ...prev, notes: event.target.value }))}
                                placeholder="Add context or links"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
                        <div className="flex items-center gap-3 sm:ml-auto">
                            {(newTask.title || newTask.dueDate || newTask.notes) && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </form>

                <div className="space-y-3">
                    {studentDisplayList.length === 0 ? (
                        <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
                            {studentFilter === 'completed' ? 'No completed tasks yet.' : 'Nothing here yet. Add a task above.'}
                        </div>
                    ) : (
                        studentDisplayList.map((task) => (
                            <div
                                key={task.id}
                                className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${
                                    task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-sm'
                                }`}
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggleStudentTask?.(task.id)}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                {task.title}
                                            </p>
                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                                                Due: {formatDueDate(task.dueDate)}
                                            </span>
                                        </div>
                                        {task.notes && <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.notes}</p>}
                                        <p className="text-xs text-gray-400">Created {task.createdLabel}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDeleteStudentTask?.(task.id)}
                                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Faculty To-dos</h2>
                        <p className="text-sm text-gray-500">Items assigned to your batch by mentors and coordinators.</p>
                    </div>
                    <div className="inline-flex bg-gray-100 rounded-full p-1">
                        {filterOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setTeacherFilter(option.id)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
                                    teacherFilter === option.id
                                        ? 'bg-green-600 text-white shadow'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="space-y-3">
                    {teacherDisplayList.length === 0 ? (
                        <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
                            {teacherFilter === 'completed' ? 'No faculty tasks completed yet.' : 'All caught up on shared tasks!'}
                        </div>
                    ) : (
                        teacherDisplayList.map((task) => (
                            <div
                                key={task.id}
                                className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                                    task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'
                                }`}
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggleTeacherTask?.(task.id)}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                                {task.course}
                                            </span>
                                            <span className="text-xs text-gray-400">by {task.assignedBy}</span>
                                        </div>
                                        <p className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-sm text-gray-600">{task.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                                    <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                                        Due: {task.dueDate}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onToggleTeacherTask?.(task.id)}
                                        className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                                            task.completed ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {task.completed ? 'Completed' : 'Mark complete'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

const SearchPage = () => (
    <div className="p-8 bg-white rounded-xl shadow-md"><h1 className="text-3xl font-bold text-gray-800">Search</h1><p className="text-gray-500 mt-2">This page is under construction.</p></div>
);

const SettingsPage = ({ user }) => {
    const settingsKey = `campusmate_settings_${user?.role || 'student'}`;
    const [form, setForm] = useState(() => {
        try {
            const stored = localStorage.getItem(settingsKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (err) {
            console.warn('Failed to parse settings', err);
        }
        return {
            emailNotifications: true,
            noticeReminders: true,
            compactMode: false,
            dailyDigestHour: '20:00',
        };
    });
    const [saved, setSaved] = useState(false);

    const updateToggle = (key) => {
        setSaved(false);
        setForm((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        localStorage.setItem(settingsKey, JSON.stringify(form));
        setSaved(true);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6 max-w-3xl">
            <header>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your dashboard preferences and reminders.</p>
            </header>

            <div className="space-y-4">
                <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                    <div>
                        <p className="font-semibold text-gray-800">Email notifications</p>
                        <p className="text-xs text-gray-500">Receive important notices and updates by email.</p>
                    </div>
                    <input type="checkbox" checked={form.emailNotifications} onChange={() => updateToggle('emailNotifications')} className="h-5 w-5" />
                </label>

                <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                    <div>
                        <p className="font-semibold text-gray-800">Notice reminders</p>
                        <p className="text-xs text-gray-500">Show reminder prompts for time-bound notices.</p>
                    </div>
                    <input type="checkbox" checked={form.noticeReminders} onChange={() => updateToggle('noticeReminders')} className="h-5 w-5" />
                </label>

                <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                    <div>
                        <p className="font-semibold text-gray-800">Compact view</p>
                        <p className="text-xs text-gray-500">Reduce card spacing in dashboard pages.</p>
                    </div>
                    <input type="checkbox" checked={form.compactMode} onChange={() => updateToggle('compactMode')} className="h-5 w-5" />
                </label>

                <label className="block border border-gray-200 rounded-xl p-4">
                    <p className="font-semibold text-gray-800">Daily digest time</p>
                    <p className="text-xs text-gray-500 mb-2">Preferred time to review tasks and upcoming events.</p>
                    <input
                        type="time"
                        value={form.dailyDigestHour}
                        onChange={(event) => {
                            setSaved(false);
                            setForm((prev) => ({ ...prev, dailyDigestHour: event.target.value }));
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </label>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    Save settings
                </button>
                {saved && <span className="text-sm text-green-600 font-medium">Saved successfully.</span>}
            </div>
        </div>
    );
};


// ==========================================
//  NO-DUES PAGE COMPONENT (The Missing Part)
// ==========================================
const NoDuesPage = ({ user }) => {
    const [clearanceItems, setClearanceItems] = useState([]);
    const [filter, setFilter] = useState({ department: 'CSE', class_year: '4', semester: '7' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDuesData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [subjectsRes, appsRes] = await Promise.all([
                getNoDuesSubjects(filter),
                getNoDuesApplications(),
            ]);

            const subjectRows = subjectsRes.data || [];
            const appRows = appsRes.data || [];
            const appBySubjectId = Object.fromEntries(appRows.map((row) => [row.subject?.id, row]));

            const mappedData = subjectRows.map((row) => {
                const app = appBySubjectId[row.id];
                let status = 'NOT_APPLIED';
                if (app?.status === 'PENDING') status = 'PENDING';
                if (app?.status === 'APPROVED') status = 'APPROVED';
                if (app?.status === 'REJECTED') status = 'REJECTED';

                return {
                    id: row.id,
                    name: row.subject_name,
                    category: 'Academic',
                    status,
                    remark: app?.remark || '',
                };
            });

            setClearanceItems(mappedData);
        } catch (error) {
            console.error('Failed to load no-dues data', error);
            setError('Could not load no-dues records. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDuesData();
        }
    }, [user, filter.department, filter.class_year, filter.semester]);

    // --- FILTERS ---
    const rejectedItems = clearanceItems.filter(i => i.status === 'REJECTED');
    const notAppliedItems = clearanceItems.filter(i => i.status === 'NOT_APPLIED');
    const pendingItems = clearanceItems.filter(i => i.status === 'PENDING');
    const approvedItems = clearanceItems.filter(i => i.status === 'APPROVED');

    // --- HANDLERS ---
    const handleRequestSingle = async (configId) => {
        try {
            await applyNoDues(configId);
            fetchDuesData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleReApply = (configId) => {
        handleRequestSingle(configId);
    };

    return (
        <div className="flex flex-col gap-6 h-full pb-20 md:pb-0 overflow-y-auto custom-scrollbar">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-end gap-3">
                    <label className="text-sm text-gray-700">
                        Department
                        <input
                            value={filter.department}
                            onChange={(event) => setFilter((prev) => ({ ...prev, department: event.target.value }))}
                            className="mt-1 ml-2 rounded-lg border border-gray-300 px-3 py-1.5"
                        />
                    </label>
                    <label className="text-sm text-gray-700">
                        Class Year
                        <input
                            value={filter.class_year}
                            onChange={(event) => setFilter((prev) => ({ ...prev, class_year: event.target.value }))}
                            className="mt-1 ml-2 rounded-lg border border-gray-300 px-3 py-1.5"
                        />
                    </label>
                    <label className="text-sm text-gray-700">
                        Semester
                        <input
                            value={filter.semester}
                            onChange={(event) => setFilter((prev) => ({ ...prev, semester: event.target.value }))}
                            className="mt-1 ml-2 rounded-lg border border-gray-300 px-3 py-1.5"
                        />
                    </label>
                    <button onClick={fetchDuesData} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">Refresh</button>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

            {isLoading && (
                <div className="text-center py-10 text-gray-500 animate-pulse">Connecting to Department Database...</div>
            )}

            {!isLoading && rejectedItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0 animate-pulse-once">
                    <div className="bg-red-100 px-4 md:px-6 py-3 border-b border-red-200 flex items-center gap-2">
                        <XIcon className="w-5 h-5 text-red-700 flex-shrink-0" />
                        <h3 className="font-bold text-red-800 text-sm md:text-base">Action Required: Rejected Requests</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {rejectedItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div>
                                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                                    <p className="text-xs md:text-sm text-red-600 mt-1 font-medium bg-red-50 inline-block px-2 py-1 rounded border border-red-100">⚠️ Remark: {item.remark}</p>
                                </div>
                                <button onClick={() => handleReApply(item.id)} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2">Fix & Re-Apply</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                <div className="bg-indigo-50 px-4 md:px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-2"><FileTextIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" /><h3 className="font-bold text-gray-800 text-sm md:text-base">Apply for Clearance</h3></div>
                    <span className="text-xs font-bold bg-white text-indigo-600 px-2 py-1 rounded-full border border-indigo-200 shadow-sm">{notAppliedItems.length} Remaining</span>
                </div>
                <div className="p-4 bg-gray-50/50">
                    {notAppliedItems.length === 0 ? (
                        <div className="text-center py-6"><CheckCircleIcon className="w-10 h-10 text-green-400 mx-auto mb-2" /><p className="text-gray-500 text-sm">All requests have been initiated.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {notAppliedItems.map(item => (
                                <div key={item.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between hover:border-indigo-400 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-2.5 rounded-full flex-shrink-0 ${item.category === 'Academic' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {item.category === 'Academic' ? <ClipboardIcon className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0"><h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</h4><p className="text-xs text-gray-500">{item.category}</p></div>
                                    </div>
                                    <button onClick={() => handleRequestSingle(item.id)} className="ml-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-indigo-100 group-hover:border-indigo-600 flex-shrink-0">Apply</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            )}

            {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="bg-orange-50 px-4 md:px-6 py-3 border-b border-orange-100 flex items-center gap-2"><ClockIcon className="w-5 h-5 text-orange-600 flex-shrink-0" /><h3 className="font-bold text-orange-800 text-sm md:text-base">Sent Requests (Pending)</h3></div>
                    <div className="p-4 space-y-2 flex-1">
                        {pendingItems.length === 0 ? <p className="text-gray-400 text-sm text-center py-4 italic">No pending requests.</p> : pendingItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm"><span className="text-gray-700 font-medium text-sm">{item.name}</span><span className="text-[10px] md:text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100 whitespace-nowrap">Waiting...</span></div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="bg-green-50 px-4 md:px-6 py-3 border-b border-green-100 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" /><h3 className="font-bold text-green-800 text-sm md:text-base">Approved</h3></div>
                    <div className="p-4 space-y-2 flex-1">
                        {approvedItems.length === 0 ? <p className="text-gray-400 text-sm text-center py-4 italic">No approvals yet.</p> : approvedItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm"><span className="text-gray-700 font-medium text-sm">{item.name}</span><span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 whitespace-nowrap"><CheckCircleIcon className="w-3 h-3"/> Cleared</span></div>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};


const Dashboard = () => {
    // --- NAVIGATION HOOK ---
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [notices, setNotices] = useState([]);
    const [studentTasks, setStudentTasks] = useState(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const stored = localStorage.getItem('student_tasks');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed.map((task) => {
                        if (task.createdLabel) {
                            return task;
                        }
                        const createdAt = task.createdAt ? new Date(task.createdAt) : null;
                        return {
                            ...task,
                            createdLabel: createdAt && !Number.isNaN(createdAt.getTime())
                                ? createdAt.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : 'Earlier',
                        };
                    });
                }
            }
        } catch (storageError) {
            console.warn('Failed to load stored student tasks', storageError);
        }
        return [];
    });
    const [completedTeacherTaskIds, setCompletedTeacherTaskIds] = useState(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const stored = localStorage.getItem('teacher_tasks_completed');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (storageError) {
            console.warn('Failed to load stored teacher task status', storageError);
        }
        return [];
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profilePanelRef = useRef(null);
    const [mstMarksData, setMstMarksData] = useState([]);
    const [mstMarksLoading, setMstMarksLoading] = useState(false);
    const [mstMarksError, setMstMarksError] = useState('');
    const [mstSemesterFilter, setMstSemesterFilter] = useState('');

    // --- MESSAGING STATE ---
    const [conversations, setConversations] = useState([]);
    const [allMessages, setAllMessages] = useState({});

    // --- GEMINI API FEATURE STATE ---
    const [studyPlan, setStudyPlan] = useState('');
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [isStudyPlanModalOpen, setIsStudyPlanModalOpen] = useState(false);
    const [daySummary, setDaySummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    // --- INITIAL DATA FETCHING ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const storedUser = {
                    name: localStorage.getItem('user_name') || 'Student',
                    email: localStorage.getItem('user_email') || '-',
                    role: localStorage.getItem('user_role') || 'student',
                    enrollment: localStorage.getItem('user_enrollment') || '-',
                    contact: '-',
                    program: 'Program',
                };

                let profileUser = null;
                if (token) {
                    try {
                        const res = await getProfile();
                        const d = res.data || {};
                        profileUser = {
                            name: d.first_name || d.email || storedUser.name,
                            email: d.email || storedUser.email,
                            role: d.role || storedUser.role,
                            enrollment: d.enrollment || storedUser.enrollment || String(d.id || ''),
                            contact: d.contact || storedUser.contact,
                            program: d.program || storedUser.program,
                        };
                    } catch (profileErr) {
                        console.warn('Profile fetch failed, using stored user', profileErr);
                    }
                }

                const finalUser = profileUser || storedUser;
                const initials = (finalUser.name || 'S').slice(0, 2).toUpperCase();

                setUser({ ...finalUser, initials });
                setAllUsers([]);

                // Fetch chat groups from backend API
                try {
                    const groupsResponse = await getChatGroups();
                    const groups = groupsResponse.data || [];
                    
                    // Convert backend groups to conversation format
                    const conversations = groups.map(group => ({
                        id: group.id,
                        name: group.name,
                        group: group.description || 'Group',
                        avatar: group.name.charAt(0),
                        lastMessage: group.last_message?.content || 'No messages yet',
                        time: group.updated_at ? new Date(group.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'
                    }));
                    
                    // Fetch messages for each group
                    const allMsg = {};
                    for (const group of groups) {
                        try {
                            const messagesResponse = await getGroupMessages(group.id);
                            const messages = messagesResponse.data || [];
                            
                            allMsg[group.id] = messages.map(msg => ({
                                sender: msg.sender?.first_name || msg.sender?.email || 'Unknown',
                                text: msg.content,
                                avatar: (msg.sender?.first_name || msg.sender?.email || 'U').slice(0, 2).toUpperCase(),
                                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }));
                        } catch (msgErr) {
                            console.warn(`Failed to fetch messages for group ${group.id}`, msgErr);
                            allMsg[group.id] = [];
                        }
                    }
                    
                    setConversations(conversations);
                    setAllMessages(allMsg);
                } catch (chatErr) {
                    console.warn('Chat groups fetch failed, using empty state', chatErr);
                    setConversations([]);
                    setAllMessages({});
                }

                let sanitizedNotices = [];
                if (token) {
                    try {
                        const noticeResponse = await apiClient.get('notices/');
                        sanitizedNotices = (noticeResponse.data || []).map((notice) => {
                            const createdAt = notice.created_at ? new Date(notice.created_at) : null;
                            const postedLabel = createdAt ? createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'New';
                            const timeLabel = createdAt ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                            return {
                                id: notice.id,
                                title: notice.title,
                                content: notice.content,
                                posted: postedLabel,
                                timeLabel,
                                raw: notice,
                            };
                        });
                    } catch (noticeErr) {
                        console.warn('Notice fetch failed, falling back to empty list', noticeErr);
                    }
                }
                if (sanitizedNotices.length === 0) {
                    sanitizedNotices = fallbackNoticeFeed;
                }
                setNotices(sanitizedNotices);
            } catch (_err) {
                setError("Couldn't load dashboard data. Please try refreshing the page.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // respond to changes in localStorage (e.g. another tab logs in as faculty)
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'user_role') {
                const newRole = e.newValue;
                if (newRole && newRole !== 'student') {
                    // if our dashboard is open but role switched, redirect away
                    if (newRole === 'faculty') {
                        window.location.href = '/faculty/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                }
            }
            if (e.key === 'user_name') {
                // update user name in state if same role still
                setUser((prev) => prev ? { ...prev, name: e.newValue } : prev);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            localStorage.setItem('student_tasks', JSON.stringify(studentTasks));
        } catch (storageError) {
            console.warn('Failed to persist student tasks', storageError);
        }
    }, [studentTasks]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            localStorage.setItem('teacher_tasks_completed', JSON.stringify(completedTeacherTaskIds));
        } catch (storageError) {
            console.warn('Failed to persist teacher task completion state', storageError);
        }
    }, [completedTeacherTaskIds]);

    useEffect(() => {
        if (!isProfileOpen) {
            return undefined;
        }
        const handleOutsideClick = (event) => {
            if (profilePanelRef.current && !profilePanelRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isProfileOpen, profilePanelRef]);

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
        localStorage.removeItem('user_enrollment');
        
        // Redirect to login page
        navigate('/student/login');
    };

    useEffect(() => {
        if (isProfileOpen) {
            setIsProfileOpen(false);
        }
    }, [activeNav]);

    useEffect(() => {
        const fetchMstMarks = async () => {
            if (activeNav !== 'MST Marks') {
                return;
            }
            setMstMarksLoading(true);
            setMstMarksError('');
            try {
                const response = await getMyMarks(mstSemesterFilter.trim());
                setMstMarksData(response.data?.entries || []);
            } catch (marksError) {
                setMstMarksError(marksError?.response?.data?.error || 'Could not load MST marks.');
            } finally {
                setMstMarksLoading(false);
            }
        };
        fetchMstMarks();
    }, [activeNav, mstSemesterFilter]);

    // --- REAL-TIME WEBSOCKET LOGIC (Skipped for brevity, same as yours) ---
    // ...

    const handleGenerateStudyPlan = async () => {
        setIsStudyPlanModalOpen(true);
        setIsGeneratingPlan(true);

        const today = new Date();
        const pendingTasks = studentTasks.filter((task) => !task.completed).slice(0, 5);
        const topNotices = notices.slice(0, 3);
        const weeklyEvents = eventShowcase.slice(0, 3);

        const lines = [
            `Personalized Study Plan for ${user?.name || 'Student'}`,
            `Generated on ${today.toLocaleString('en-IN')}`,
            '',
            '1) Priority Focus (Today):',
        ];

        if (pendingTasks.length === 0) {
            lines.push('- Revise core concepts for 45 minutes and solve 10 mixed practice questions.');
        } else {
            pendingTasks.forEach((task, index) => {
                lines.push(`${index + 1}. ${task.title}${task.dueDate ? ` (due ${task.dueDate})` : ''}`);
            });
        }

        lines.push('', '2) Weekly Rhythm:');
        lines.push('- Mon-Wed-Fri: 2-hour deep work block for difficult subjects.');
        lines.push('- Tue-Thu: 1-hour revision + 30-minute quiz practice.');
        lines.push('- Sat: Mock test + weak-topic review.');
        lines.push('- Sun: Consolidation, notes cleanup, and next-week planning.');

        if (topNotices.length > 0) {
            lines.push('', '3) Important Notices to Track:');
            topNotices.forEach((notice) => lines.push(`- ${notice.title}`));
        }

        if (weeklyEvents.length > 0) {
            lines.push('', '4) Campus Events You Should Leverage:');
            weeklyEvents.forEach((event) => lines.push(`- ${event.title} (${event.date})`));
        }

        lines.push('', '5) Daily Checklist:');
        lines.push('- 25 min revision of previous class notes.');
        lines.push('- 60-90 min focused study without distractions.');
        lines.push('- 15 min summary notes at end of session.');

        setStudyPlan(lines.join('\n'));
        setIsGeneratingPlan(false);
    };

    const handleGenerateDaySummary = async (events, date) => {
        setIsSummaryModalOpen(true);
        setIsGeneratingSummary(true);

        const sorted = [...events].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        const lines = [
            `Day Summary for ${date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}`,
            '',
        ];

        if (sorted.length === 0) {
            lines.push('No events scheduled. Use this as a deep-study day and complete pending tasks.');
        } else {
            sorted.forEach((event, index) => {
                lines.push(`${index + 1}. ${event.time || '--:--'} - ${event.title}`);
                if (event.details) {
                    lines.push(`   Notes: ${event.details}`);
                }
            });
            lines.push('', 'Recommended flow: Finish high-focus work before first event and reserve evening for revision.');
        }

        setDaySummary(lines.join('\n'));
        setIsGeneratingSummary(false);
    };

    // --- UI RENDERING LOGIC ---
    if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div>;
    if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center"><div><h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2><p className="text-gray-600 mt-2">{error}</p></div></div>;
    
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Tasks', icon: ClipboardIcon }, 
        { name: 'MST Marks', icon: ClipboardIcon },
        { name: 'Messages', icon: MessageSquareIcon },
        { name: 'Search', icon: SearchIcon },
        { name: 'Calendar', icon: CalendarIcon },
        { name: 'No-Dues', icon: FileTextIcon },
        { name: 'Study Plan', icon: SparklesNavIcon },
    ];

    const handleNavClick = (navItem) => {
        if (navItem === 'Study Plan') {
            navigate('/study-plan');
            setIsSidebarOpen(false);
            return;
        }
        setActiveNav(navItem);
        setIsSidebarOpen(false);
    };

    const handleAddStudentTask = ({ title, dueDate, notes }) => {
        const createdAt = new Date();
        const formattedCreated = createdAt.toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const newTask = {
            id: `student-${createdAt.getTime()}`,
            title,
            dueDate: dueDate || '',
            notes: notes || '',
            completed: false,
            createdAt: createdAt.toISOString(),
            createdLabel: formattedCreated,
        };
        setStudentTasks((prev) => [newTask, ...prev]);
    };

    const handleToggleStudentTask = (taskId) => {
        setStudentTasks((prev) => prev.map((task) => (
            task.id === taskId ? { ...task, completed: !task.completed } : task
        )));
    };

    const handleDeleteStudentTask = (taskId) => {
        setStudentTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    const handleToggleTeacherTask = (taskId) => {
        setCompletedTeacherTaskIds((prev) => (
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        ));
    };

    const handleClearCompletedStudentTasks = () => {
        setStudentTasks((prev) => prev.filter((task) => !task.completed));
    };

    const renderActivePage = () => {
        switch (activeNav) {
            case 'Dashboard':
                return (
                    <DashboardPage
                        user={user}
                        notices={notices}
                        hackathons={hackathonShowcase}
                        events={eventShowcase}
                        importantLinks={quickLinksSeed}
                        handleGenerateStudyPlan={handleGenerateStudyPlan}
                        isGeneratingPlan={isGeneratingPlan}
                    />
                );
            case 'Tasks': 
                return (
                    <TasksPage
                        teacherTasks={teacherTaskFeed}
                        studentTasks={studentTasks}
                        onAddStudentTask={handleAddStudentTask}
                        onToggleStudentTask={handleToggleStudentTask}
                        onDeleteStudentTask={handleDeleteStudentTask}
                        completedTeacherTaskIds={completedTeacherTaskIds}
                        onToggleTeacherTask={handleToggleTeacherTask}
                        onClearCompletedStudentTasks={handleClearCompletedStudentTasks}
                    />
                );
            case 'MST Marks':
                return (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">My MST Marks</h3>
                                <p className="text-sm text-gray-500">View all MST marks entered by faculty (out of 20).</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    value={mstSemesterFilter}
                                    onChange={(event) => setMstSemesterFilter(event.target.value)}
                                    placeholder="Filter semester (e.g., Sem 4)"
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {mstMarksError && <p className="text-sm text-red-600 mb-3">{mstMarksError}</p>}

                        {mstMarksLoading ? (
                            <div className="py-10 text-sm text-gray-500">Loading marks...</div>
                        ) : mstMarksData.length === 0 ? (
                            <div className="py-10 text-sm text-gray-500">No MST marks found for the selected semester.</div>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Subject</th>
                                            <th className="px-4 py-3 text-left font-medium">Semester</th>
                                            <th className="px-4 py-3 text-left font-medium">Marks</th>
                                            <th className="px-4 py-3 text-left font-medium">Entered By</th>
                                            <th className="px-4 py-3 text-left font-medium">Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-gray-700">
                                        {mstMarksData.map((entry) => (
                                            <tr key={entry.id}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{entry.subject}</td>
                                                <td className="px-4 py-3">{entry.semester}</td>
                                                <td className="px-4 py-3">{entry.marks}/{entry.max_marks}</td>
                                                <td className="px-4 py-3">{entry.entered_by_email || 'Faculty'}</td>
                                                <td className="px-4 py-3">{new Date(entry.updated_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'Messages':
                return <MessagesPage conversations={conversations} setConversations={setConversations} allMessages={allMessages} setAllMessages={setAllMessages} allUsers={allUsers} currentUser={user} />;
            case 'Calendar':
                return <CalendarPage handleGenerateDaySummary={handleGenerateDaySummary} isGeneratingSummary={isGeneratingSummary} />;
            case 'No-Dues': // Added No-Dues Case
                return <NoDuesPage user={user} />;
            case 'Search':
                return <SearchPage />;
            case 'Settings':
                  return <SettingsPage user={user} />;
            default:
                return (
                    <DashboardPage
                        user={user}
                        notices={notices}
                        hackathons={hackathonShowcase}
                        events={eventShowcase}
                        importantLinks={quickLinksSeed}
                        handleGenerateStudyPlan={handleGenerateStudyPlan}
                        isGeneratingPlan={isGeneratingPlan}
                    />
                );
        }
    };
    
    const Sidebar = () => (
        <aside className={`bg-white w-64 min-h-screen flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-center h-20">
             <div className="flex flex-col items-center justify-center bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-lg leading-tight">
  <span className="text-sm font-medium tracking-[0.2em] opacity-90 uppercase">
    CampusMate
  </span>
  <span className="text-2xl font-black tracking-tight">
    Student Panel
  </span>
</div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <a href="#" key={item.name} onClick={() => handleNavClick(item.name)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeNav === item.name ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <item.icon className="h-6 w-6" />
                        <span className="font-semibold">{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-6">
                <a href="#" onClick={() => handleNavClick('Settings')} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeNav === 'Settings' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <SettingsIcon className="h-6 w-6" />
                    <span className="font-semibold">Settings</span>
                </a>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"></div>}
            
            <div className={`fixed top-0 left-0 h-full z-20 md:relative md:z-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                 <Sidebar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                 <header className="bg-white border-b border-gray-200 md:hidden flex items-center justify-between p-4 h-20 flex-shrink-0">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600"><MenuIcon className="h-6 w-6" /></button>
                    <div className="text-xl font-bold text-gray-800">{activeNav}</div>
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label="Open profile panel"
                    >
                        {user?.initials || 'ST'}
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                     <header className="hidden md:flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{activeNav}</h1>
                            {activeNav === 'Dashboard' && <p className="text-sm text-gray-500 mt-1">Here&apos;s what is happening across campus today.</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm hover:border-indigo-300 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            aria-label="Open profile panel"
                        >
                            <span className="text-sm text-gray-600">{user?.name || 'Student'}</span>
                            <span className="bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">{user?.initials || 'ST'}</span>
                        </button>
                     </header>
                    {renderActivePage()}
                </main>
            </div>
            
            {isProfileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30"
                        onClick={() => setIsProfileOpen(false)}
                        role="presentation"
                    />
                    <div
                        ref={profilePanelRef}
                        className="fixed z-40 right-4 top-24 md:right-8 md:top-24 w-[min(90vw,320px)] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                                    {user?.initials || 'ST'}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{user?.name || 'Student'}</p>
                                    <p className="text-xs uppercase tracking-wide text-gray-400">{user?.role || 'student'}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close profile panel"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">Institutional Email</p>
                                <p className="mt-1 break-words">{user?.email || 'Unavailable'}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Enrollment Number</p>
                                    <p className="mt-1 text-gray-700">{user?.enrollment || 'NA'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Contact</p>
                                    <p className="mt-1 text-gray-700">{user?.contact || 'Update via profile desk'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button
                                type="button"
                                className="w-full text-sm font-semibold text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg py-2 transition"
                                onClick={() => {
                                    setActiveNav('Settings');
                                    setIsProfileOpen(false);
                                }}
                            >
                                Manage profile & settings
                            </button>
                            <button
                                type="button"
                                className="w-full text-sm font-semibold text-red-600 border border-red-100 hover:border-red-300 hover:bg-red-50 rounded-lg py-2 transition"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <p className="text-[11px] text-gray-400 text-center">Need edits? Contact faculty advisor for official changes.</p>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Logic (StudyPlan, Summary) can remain here */}
            {isStudyPlanModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Your AI-Generated Study Plan</h2>
                        {isGeneratingPlan ? <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div> : <div className="text-gray-600 whitespace-pre-wrap leading-relaxed space-y-4">{studyPlan}</div>}
                         <button onClick={() => setIsStudyPlanModalOpen(false)} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Close</button>
                    </div>
                </div>
            )}
            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 AI-Generated Day Summary</h2>
                        {isGeneratingSummary ? <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div> : <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{daySummary}</div>}
                         <button onClick={() => setIsSummaryModalOpen(false)} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;