import React, { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
// Using inline SVGs for portability, so no extra dependencies are needed.
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
// 📝 NEW: Clipboard Icon for Tasks
const ClipboardIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);


// --- Page Components ---

const DashboardPage = ({ user, attendance, cgpa, sgpa, handleGenerateStudyPlan, isGeneratingPlan }) => (
    <div className="space-y-8">
        {/* Main Student Info Card */}
        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg flex items-center space-x-6">
            <div className="bg-white text-indigo-600 rounded-full h-20 w-20 flex-shrink-0 flex items-center justify-center font-bold text-lg">
                Student
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
                <div><p className="font-bold text-xl">{user.name}</p><p className="text-sm text-indigo-200">Enrollment: {user.enrollment}</p></div>
                <div><p className="font-semibold">Email</p><p className="text-sm text-indigo-200">{user.email}</p></div>
                <div><p className="font-semibold">Contact</p><p className="text-sm text-indigo-200">{user.contact}</p></div>
            </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-lg text-gray-700 mb-4">Academic Details</h3>
                <div className="flex items-baseline space-x-2"><p className="text-5xl font-bold text-indigo-600">{cgpa}</p><span className="text-gray-500">CGPA</span></div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                    {Object.entries(sgpa).map(([sem, gpa]) => (<p key={sem}><span className="font-semibold">SGPA ({sem}):</span> {gpa}</p>))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <h3 className="font-bold text-lg text-gray-700">Attendance</h3>
                <p className="text-6xl font-bold text-green-500 my-4">{attendance}</p>
                <p className="text-gray-500 text-sm">Last updated: Just now</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-gray-700 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button onClick={handleGenerateStudyPlan} disabled={isGeneratingPlan} className="w-full text-left bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold p-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGeneratingPlan ? 'Generating...' : '✨ Generate Study Plan'}
                    </button>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors">View Mid Semester Marks</button>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors">Download Fee Receipt</button>
                </div>
            </div>
        </div>
    </div>
);

const MessagesPage = ({ conversations, setConversations, allMessages, setAllMessages, allUsers, currentUser }) => {
    const [activeConversationId, setActiveConversationId] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    const chatEndRef = useRef(null);

    // Effect to scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages, activeConversationId]);
    
    const handleConversationSelect = (id) => {
        setActiveConversationId(id);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageToSend = {
            sender: 'You',
            text: newMessage,
            avatar: currentUser.initials,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setAllMessages(prevMessages => {
            const currentMessages = prevMessages[activeConversationId] || [];
            return { ...prevMessages, [activeConversationId]: [...currentMessages, messageToSend] };
        });

        setConversations(prevConvos => {
            const convoToUpdate = prevConvos.find(c => c.id === activeConversationId);
            const otherConvos = prevConvos.filter(c => c.id !== activeConversationId);
            const updatedConvo = { ...convoToUpdate, lastMessage: newMessage, time: 'Just now' };
            return [updatedConvo, ...otherConvos];
        });

        setNewMessage('');
    };
    
    const startNewConversation = (user) => {
        const newId = conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1;
        const newConversation = {
            id: newId,
            name: user.name,
            group: 'Direct Message',
            avatar: user.initials,
            lastMessage: 'Conversation started.',
            time: 'Just now'
        };
        setConversations(prev => [newConversation, ...prev]);
        setAllMessages(prev => ({...prev, [newId]: [] }));
        setActiveConversationId(newId);
        setIsNewConvoModalOpen(false);
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeMessages = allMessages[activeConversationId] || [];

    return (
        <>
            {isNewConvoModalOpen && (
                <NewConversationModal 
                    onClose={() => setIsNewConvoModalOpen(false)}
                    onStartConversation={startNewConversation}
                    allUsers={allUsers}
                    currentUser={currentUser}
                />
            )}
            <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-md overflow-hidden">
                {/* Left: Conversations List */}
                <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                            <button onClick={() => setIsNewConvoModalOpen(true)} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <input type="text" placeholder="Search Messages" className="w-full mt-4 p-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <div key={convo.id} onClick={() => handleConversationSelect(convo.id)} className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 ${convo.id === activeConversationId ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}>
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">{convo.avatar}</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 truncate">{convo.name}</p>
                                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{convo.time}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right: Chat Window */}
                <div className={`w-2/3 hidden md:flex flex-col ${activeConversation ? '' : 'justify-center items-center'}`}>
                    {activeConversation ? (
                        <>
                            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 h-20 flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">{activeConversation.avatar}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{activeConversation.name}</h3>
                                    <p className="text-sm text-gray-500">{activeConversation.group}</p>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-6">
                                {activeMessages.map((msg, index) => (
                                    <div key={index} className={`flex items-start space-x-4 ${msg.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${msg.sender === 'You' ? 'bg-indigo-200' : 'bg-gray-300'}`}>{msg.avatar}</div>
                                        <div className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                            <p className="font-semibold text-gray-800 text-sm">{msg.sender}</p>
                                            <div className={`p-3 rounded-lg mt-1 max-w-lg whitespace-pre-wrap ${msg.sender === 'You' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                 <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-3 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors">
                                        <SendIcon className="w-6 h-6" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                            <MessageSquareIcon className="w-16 h-16 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold">Select a conversation</h2>
                            <p>Choose one of your existing conversations to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const NewConversationModal = ({ onClose, onStartConversation, allUsers, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.name !== currentUser.name
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col h-[60vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold">New Conversation</h3>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                 <div className="flex-shrink-0">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search for users..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div className="mt-4 flex-1 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <li key={user.name} onClick={() => onStartConversation(user)} className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">{user.initials}</div>
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 mt-8">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const CalendarPage = ({ handleGenerateDaySummary, isGeneratingSummary }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Defaults to today
    const [selectedDate, setSelectedDate] = useState(new Date()); // Defaults to today
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', time: '10:00', type: 'event', details: '' });
    
    // In a real app, this would come from an API.
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

    const handleDateClick = (day) => {
        const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelectedDate);
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        const newEventObject = {
            ...newEvent,
            date: selectedDate.toISOString().split('T')[0],
        };
        // To persist events, you would send this to a backend API instead of just updating state.
        setEvents([...events, newEventObject]);
        setIsEventModalOpen(false);
        setNewEvent({ title: '', time: '10:00', type: 'event', details: '' });
    };

    const selectedDateEvents = events.filter(event => {
        const eventDate = new Date(event.date + 'T00:00:00');
        return eventDate.toDateString() === selectedDate.toDateString();
    });

    const EventModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add Event for {selectedDate.toLocaleDateString()}</h3>
                    <button onClick={() => setIsEventModalOpen(false)}><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSaveEvent}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Details</label>
                            <textarea value={newEvent.details} onChange={e => setNewEvent({...newEvent, details: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="event">Event</option>
                                <option value="important">Important</option>
                                <option value="hackathon">Hackathon</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    const eventTypeClasses = {
        important: { border: 'border-purple-500', bg: 'bg-purple-50', dot: 'bg-purple-500' },
        hackathon: { border: 'border-green-500', bg: 'bg-green-50', dot: 'bg-green-500' },
        event: { border: 'border-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {isEventModalOpen && <EventModal />}
            {/* Left: Calendar Grid */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
                    {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
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
                                <div className="flex justify-center space-x-1 mt-1">
                                    {dayEvents.slice(0, 3).map((e, i) => <div key={i} className={`w-2 h-2 rounded-full ${eventTypeClasses[e.type]?.dot}`}></div>)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* Right: Events List */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Events for {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}</h3>
                    <button onClick={() => setIsEventModalOpen(true)} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"><PlusIcon className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 h-80 overflow-y-auto pr-2">
                    {selectedDateEvents.length > 0 ? selectedDateEvents.sort((a,b) => a.time.localeCompare(b.time)).map((event, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${eventTypeClasses[event.type]?.border} ${eventTypeClasses[event.type]?.bg}`}>
                            <p className="text-sm text-gray-500">{new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="font-bold text-gray-800">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.details}</p>
                        </div>
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

// 📝 NEW: Tasks Page Component
const TasksPage = () => (
    <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <p className="text-gray-500 mt-2">Manage your project milestones and daily to-dos.</p>
        <div className="mt-8 space-y-4">
            {/* Example Task Item */}
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <input type="checkbox" className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <div className="ml-4">
                    <p className="font-semibold text-gray-800">Finalize Project Proposal</p>
                    <p className="text-sm text-gray-500">Due: Tomorrow</p>
                </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <input type="checkbox" className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <div className="ml-4">
                    <p className="font-semibold text-gray-800">Review Physics Notes</p>
                    <p className="text-sm text-gray-500">Due: Friday</p>
                </div>
            </div>
        </div>
    </div>
);

const SearchPage = () => (
    <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Search</h1>
        <p className="text-gray-500 mt-2">This page is under construction.</p>
    </div>
);

const SettingsPage = () => (
    <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-2">This page is under construction.</p>
    </div>
);


const Dashboard = () => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [attendance, setAttendance] = useState('');
    const [cgpa, setCgpa] = useState(0);
    const [sgpa, setSgpa] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('Dashboard');

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
                const userData = await new Promise(resolve => resolve({
                    role: 'student',
                    name: 'Alex Doe',
                    initials: 'AD',
                    enrollment: '0832CS231076',
                    email: 'alex.doe@example.com',
                    contact: '7648880008',
                    program: 'Computer Science',
                    attendance: '78%',
                    cgpa: 7.34,
                    sgpa: {
                        '6th': '7.54', '5th': '7.29', '4th': '6.9',
                        '3rd': '7.04', '2nd': '7.19', '1st': '6.49',
                    }
                }));
                 const messageData = await new Promise(resolve => resolve({
                    conversations: [
                        { id: 1, name: 'CSE VII B', group: '2022-26', avatar: '🎓', lastMessage: 'All students are kindly informed...', time: '12m' },
                        { id: 2, name: 'Placement CSE', group: 'Official', avatar: '💼', lastMessage: 'Infosys Certification & top...', time: '1h' },
                        { id: 3, name: 'GDGDC-GDGI', group: 'Learn, Build, Connect', avatar: '🚀', lastMessage: 'Hackathon winners announced!', time: '5h' },
                        { id: 4, name: 'Manoj Sir', group: 'Project Coordinator', avatar: '👨‍🏫', lastMessage: 'Submit your reports by Friday.', time: '2d' },
                    ],
                    allMessages: {
                        1: [
                            { sender: 'Paras Sir', text: "All students are kindly informed to report at seminar hall 01 for 'Campus to Career' session", avatar: '👨‍💼', time: '10:30 AM' },
                            { sender: 'Vikrant Sir', text: "Dear Students, Infosys Certification & top Hackathons have been shared. Great chance to learn and grow- do participate!", avatar: '👨‍💼', time: '10:32 AM' },
                        ],
                        2: [{ sender: 'Placement Cell', text: 'Reminder: Resume submission deadline is tomorrow.', avatar: '💼', time: 'Yesterday' }],
                        3: [{ sender: 'Event Team', text: 'Don\'t miss the workshop on Web3 this weekend!', avatar: '🚀', time: 'Yesterday' }],
                        4: [{ sender: 'Manoj Sir', text: 'The project guidelines have been updated. Please check the portal.', avatar: '👨‍🏫', time: 'Yesterday' }],
                    }
                }));
                const allUsersData = await new Promise(resolve => resolve([
                    { name: 'Paras Sir', initials: 'PS', role: 'Faculty' },
                    { name: 'Vikrant Sir', initials: 'VS', role: 'Faculty' },
                    { name: 'Manoj Sir', initials: 'MS', role: 'Coordinator' },
                    { name: 'Jane Smith', initials: 'JS', role: 'Student' },
                    { name: 'Jane Smith', initials: 'JS', role: 'Student' },
                ]));
                setUser(userData);
                setAllUsers(allUsersData);
                setAttendance(userData.attendance);
                setCgpa(userData.cgpa);
                setSgpa(userData.sgpa);
                setConversations(messageData.conversations);
                setAllMessages(messageData.allMessages);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Couldn't load dashboard data. Please try refreshing the page.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);


    // --- REAL-TIME WEBSOCKET LOGIC ---
    useEffect(() => {
        if (!user) return;
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/dashboard/');
        socket.onopen = () => console.log('✅ WebSocket connection successful!');
        socket.onmessage = (event) => {
            const serverUpdate = JSON.parse(event.data);
            const { action, data } = serverUpdate.payload;
            console.log('🔥 Real-time update received:', action, data);
            switch (action) {
                case 'ATTENDANCE_UPDATED':
                    setAttendance(data.newAttendance);
                    break;
                case 'GRADES_UPDATED':
                    setCgpa(data.newCgpa);
                    if(data.newSgpa) setSgpa(data.newSgpa);
                    break;
                case 'NEW_MESSAGE':
                    setAllMessages(prev => ({
                        ...prev,
                        [data.conversationId]: [...(prev[data.conversationId] || []), data.message]
                    }));
                    setConversations(prev => {
                        const convoToUpdate = prev.find(c => c.id === data.conversationId);
                        const otherConvos = prev.filter(c => c.id !== data.conversationId);
                        const updatedConvo = { ...convoToUpdate, lastMessage: data.message.text, time: 'Just now' };
                        return [updatedConvo, ...otherConvos];
                    });
                    break;
                default:
                    console.warn('Received an unhandled action:', action);
            }
        };
        socket.onclose = () => console.log('❌ WebSocket connection closed.');
        return () => socket.close();
    }, [user]);


    // --- GEMINI API CALLS ---
    const handleGenerateStudyPlan = async () => {
        setIsGeneratingPlan(true);
        setStudyPlan('');
        setIsStudyPlanModalOpen(true);
        const apiKey = "YOUR_GOOGLE_AI_API_KEY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const sgpaString = Object.entries(sgpa).map(([sem, gpa]) => `Semester ${sem}: ${gpa}`).join(', ');
        const prompt = `Act as an academic advisor for a university student. Based on the following data, generate a concise, encouraging, and actionable study plan. The student is in the ${user.program} program. Current CGPA: ${cgpa}. Semester-wise GPA (SGPA): ${sgpaString}. The study plan should include: 1. A brief, positive analysis of the grade trend. 2. Three specific, actionable study tips to improve grades. 3. A short, motivational closing statement. Format the response clearly with headings or bullet points.`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            if (apiKey === "YOUR_GOOGLE_AI_API_KEY") {
                throw new Error("Please replace 'YOUR_GOOGLE_AI_API_KEY' with your actual API key.");
            }
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                let errorDetails = `API call failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData?.error?.message || JSON.stringify(errorData);
                } catch (e) {
                    errorDetails += ` - ${response.statusText}`;
                }
                throw new Error(errorDetails);
            }
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
                setStudyPlan(generatedText.replace(/\*/g, '•'));
            } else {
                setStudyPlan('Could not generate a study plan at this time.');
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            setStudyPlan(`An error occurred: ${error.message}`);
        } finally {
            setIsGeneratingPlan(false);
        }
    };
    
    const handleGenerateDaySummary = async (events, date) => {
        setIsGeneratingSummary(true);
        setDaySummary('');
        setIsSummaryModalOpen(true);
        const apiKey = "YOUR_GOOGLE_AI_API_KEY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const eventsString = events.map(e => `- ${e.time}: ${e.title} (${e.details}) - Type: ${e.type}`).join('\n');
        const prompt = `Act as a personal assistant. Summarize the following schedule for ${date.toLocaleDateString()} in a single, friendly paragraph. \n\nEvents:\n${eventsString}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        try {
             if (apiKey === "YOUR_GOOGLE_AI_API_KEY") {
                throw new Error("Please replace 'YOUR_GOOGLE_AI_API_KEY' with your actual API key.");
            }
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                 let errorDetails = `API call failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData?.error?.message || JSON.stringify(errorData);
                } catch (e) {
                    errorDetails += ` - ${response.statusText}`;
                }
                throw new Error(errorDetails);
            }
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
             if (generatedText) {
                setDaySummary(generatedText);
            } else {
                setDaySummary('Could not generate a summary at this time.');
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            setDaySummary(`An error occurred: ${error.message}`);
        } finally {
            setIsGeneratingSummary(false);
        }
    };


    // --- UI RENDERING LOGIC ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        );
    }
    
    // 📝 UPDATED: Added "Tasks" to navItems
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Tasks', icon: ClipboardIcon }, 
        { name: 'Messages', icon: MessageSquareIcon },
        { name: 'Search', icon: SearchIcon },
        { name: 'Calendar', icon: CalendarIcon },
    ];

    const handleNavClick = (navItem) => {
        setActiveNav(navItem);
        setIsSidebarOpen(false); 
    }

    const renderActivePage = () => {
        switch (activeNav) {
            case 'Dashboard':
                return <DashboardPage 
                            user={user} 
                            attendance={attendance} 
                            cgpa={cgpa} 
                            sgpa={sgpa} 
                            handleGenerateStudyPlan={handleGenerateStudyPlan}
                            isGeneratingPlan={isGeneratingPlan}
                        />;
            case 'Tasks': // 📝 NEW: Switch case for Tasks
                return <TasksPage />;
            case 'Messages':
                return <MessagesPage 
                            conversations={conversations} 
                            setConversations={setConversations} 
                            allMessages={allMessages} 
                            setAllMessages={setAllMessages}
                            allUsers={allUsers}
                            currentUser={user}
                        />;
            case 'Calendar':
                return <CalendarPage 
                            handleGenerateDaySummary={handleGenerateDaySummary}
                            isGeneratingSummary={isGeneratingSummary}
                        />;
            case 'Search':
                return <SearchPage />;
            case 'Settings':
                 return <SettingsPage />;
            default:
                return <DashboardPage 
                            user={user} 
                            attendance={attendance} 
                            cgpa={cgpa} 
                            sgpa={sgpa} 
                            handleGenerateStudyPlan={handleGenerateStudyPlan}
                            isGeneratingPlan={isGeneratingPlan}
                        />;
        }
    };
    
    const Sidebar = () => (
        <aside className={`bg-white w-64 min-h-screen flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-center h-20">
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-bold">Q</div>
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
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="text-xl font-bold text-gray-800">{activeNav}</div>
                    <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">{user?.initials}</div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                     <header className="hidden md:flex justify-between items-center mb-8">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800">{activeNav}</h1>
                         </div>
                     </header>
                    {renderActivePage()}
                </main>
            </div>


            {/* Modals */}
            {isStudyPlanModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Your AI-Generated Study Plan</h2>
                        {isGeneratingPlan ? (
                             <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="text-gray-600 whitespace-pre-wrap leading-relaxed space-y-4">
                                {studyPlan}
                            </div>
                        )}
                         <button onClick={() => setIsStudyPlanModalOpen(false)} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 AI-Generated Day Summary</h2>
                        {isGeneratingSummary ? (
                             <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {daySummary}
                            </div>
                        )}
                         <button onClick={() => setIsSummaryModalOpen(false)} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;