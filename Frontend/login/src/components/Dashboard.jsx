import React, { useState, useEffect, useRef } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

// --- Import Page Components ---
import NoticePage from './NoticePage.jsx';
import ProfileInfoPage from './ProfileInfoPage.jsx'; // <-- UPDATED IMPORT
import MessagesPage from './MessagesPage.jsx';
import CalendarPage from './CalendarPage.jsx';
import SearchPage from './SearchPage.jsx';
import SettingsPage from './SettingsPage.jsx';

// --- Icon Components ---
const HomeIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> );
const MessageSquareIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> );
const SearchIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> );
const CalendarIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> );
const SettingsIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> );
const MenuIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg> );
const BellIcon = ({ className }) => ( /* ... SVG ... */ <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> );
// --- ADDED UserIcon ---
const UserIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> );


// --- Define navItems using the icons ---
const navItems = [
    { name: 'Notice & Updates', icon: BellIcon },
    { name: 'Profile Info', icon: UserIcon }, // <-- UPDATED NAME AND ICON
    { name: 'Messages', icon: MessageSquareIcon },
    { name: 'Search', icon: SearchIcon },
    { name: 'Calendar', icon: CalendarIcon },
];

// --- Main Dashboard Container Component ---
const Dashboard = () => {
    const navigate = useNavigate();
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [attendance, setAttendance] = useState('');
    const [cgpa, setCgpa] = useState(0);
    const [sgpa, setSgpa] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('Notice & Updates'); // Default page
    const [conversations, setConversations] = useState([]);
    const [allMessages, setAllMessages] = useState({});

    // --- Placeholder Functions for features ---
    const handleGenerateStudyPlan = () => { console.log("AI Study Plan Triggered"); };
    const handleGenerateDaySummary = () => { console.log("AI Day Summary Triggered"); };

    // --- INITIAL DATA FETCHING ---
    useEffect(() => {
        const fetchInitialData = async () => {
            console.log("Dashboard useEffect: Starting fetchInitialData...");
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.log("Dashboard useEffect: No token found, redirecting.");
                navigate('/student/login'); setIsLoading(false); return;
            }
            console.log("Dashboard useEffect: Token found, fetching profile...");
            try {
                if (typeof api === 'undefined') throw new Error("API client missing.");
                const profileResponse = await api.get('profile/');
                if (!profileResponse || !profileResponse.data) throw new Error("Empty profile data.");
                console.log("Dashboard useEffect: Profile data received:", profileResponse.data);

                const userData = {
                    role: profileResponse.data.role || 'student', name: profileResponse.data.username || 'User', initials: profileResponse.data.username ? profileResponse.data.username.slice(0, 2).toUpperCase() : '??', email: profileResponse.data.email || 'N/A', enrollment: '0832CSXXXXXX', contact: 'XXXXXXXXXX', program: 'Computer Science',
                };
                setUser(userData);
                console.log("Dashboard useEffect: Setting mock data...");
                // --- MOCK DATA (Replace later) ---
                const messageData = { conversations: [ { id: 1, name: 'Group A', avatar: 'G', lastMessage: 'Hello', time: '10m' }], allMessages: { 1: [] } };
                const usersData = [ { name: 'Admin User', initials: 'AU', role: 'Admin' } ];
                setAllUsers(usersData); setAttendance('78%'); setCgpa(7.34); setSgpa({ '6th': '7.54', /* ... */ }); setConversations(messageData.conversations); setAllMessages(messageData.allMessages);
                console.log("Dashboard useEffect: Mock data set.");
            } catch (err) {
                console.error("Dashboard useEffect: Profile fetch FAILED:", err);
                setError("Could not load user profile. Please try logging in again.");
            } finally {
                console.log("Dashboard useEffect: Setting loading to false.");
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [navigate]);

    // --- LOGOUT FUNCTION ---
    const handleLogout = () => {
        console.log("handleLogout called...");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/student/login');
    };

    // --- UI RENDERING LOGIC ---
    if (isLoading) { return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div> ); }
    if (error) { return ( <div className="min-h-screen bg-red-50 flex items-center justify-center text-center p-4"> <div> <h2 className="text-xl font-semibold text-red-700">Oops! Something went wrong.</h2> <p className="text-red-600 mt-2">{error}</p> <button onClick={handleLogout} className="mt-4 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Go to Login</button> </div> </div> ); }
    if (!user) { return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <p className="text-gray-500">Could not load user data. Redirecting...</p> </div> ); }

    // --- Navigation Click Handler ---
    const handleNavClick = (navItem) => {
        setActiveNav(navItem);
        setIsSidebarOpen(false);
    }

    // --- Renders the currently active page component ---
    const renderActivePage = () => {
        console.log(`Rendering page: ${activeNav}`);
        try {
            switch (activeNav) {
                case 'Notice & Updates': return <NoticePage />;
                // --- UPDATED CASE ---
                case 'Profile Info':
                     if (!user || !sgpa) { console.error("Missing props for ProfileInfoPage"); return <div className="p-4 text-red-500">Error rendering profile.</div>; }
                     return <ProfileInfoPage user={user} attendance={attendance} cgpa={cgpa} sgpa={sgpa} handleGenerateStudyPlan={handleGenerateStudyPlan} isGeneratingPlan={false}/>; // Pass needed props
                // --------------------
                case 'Messages':
                     if (!conversations || !allMessages || !allUsers || !user) { console.error("Missing props for MessagesPage"); return <div className="p-4 text-red-500">Error rendering messages.</div>; }
                     return <MessagesPage conversations={conversations} setConversations={setConversations} allMessages={allMessages} setAllMessages={setAllMessages} allUsers={allUsers} currentUser={user} />;
                case 'Calendar': return <CalendarPage handleGenerateDaySummary={handleGenerateDaySummary} isGeneratingSummary={false} />;
                case 'Search': return <SearchPage />;
                case 'Settings': return <SettingsPage />;
                default: return <NoticePage />;
            }
        } catch (componentError) { console.error(`Error rendering component ${activeNav}:`, componentError); return <div className="p-4 text-red-600 font-semibold">Error loading section.</div>; }
    };

    // --- Sidebar Component ---
    // --- Sidebar Component (Logo Added) ---
    // --- Sidebar Component (Corrected Structure) ---
    const Sidebar = ({ navItems }) => (
        <aside className={`bg-white w-64 min-h-screen flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} md:translate-x-0 md:relative md:shadow-md border-r border-gray-200`}>
            {/* --- LOGO --- */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-center h-20 flex-shrink-0">
                 {/* Use the direct path from the public folder */}
                <img
                    src="/logo.png.jpg"
                    alt="Campusmate Logo"
                    className="h-12 w-auto" /* Adjust height as needed */
                    onError={(e) => { e.target.style.display = 'none'; /* Hide if logo fails */ }}
                 />
            </div>
            {/* --- END LOGO --- */}

            {/* --- NAVIGATION SECTION (Ensure this is present) --- */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                 {/* Loop over the navItems prop */}
                {navItems.map(item => (
                    <a href="#" key={item.name} onClick={() => handleNavClick(item.name)}
                       className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeNav === item.name ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                        <item.icon className={`h-6 w-6 flex-shrink-0 ${activeNav === item.name ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </a>
                ))}
            </nav>
            {/* --- END NAVIGATION SECTION --- */}

            {/* --- LOGOUT BUTTON SECTION (Ensure this is present) --- */}
            <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0">
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold group">
                    <svg className="h-6 w-6 text-red-400 group-hover:text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="text-sm">Logout</span>
                </button>
            </div>
             {/* --- END LOGOUT BUTTON SECTION --- */}
        </aside>
    );

    // --- Main Layout ---
    return (
        <div className="min-h-screen bg-gray-100 font-sans flex antialiased">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
            <div className={`fixed top-0 left-0 h-full z-30 md:relative md:z-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <Sidebar navItems={navItems} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 h-20 flex-shrink-0 sticky top-0 z-10 shadow-sm">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700 md:hidden p-2 -ml-2"> <MenuIcon className="h-6 w-6" /> </button>
                    <div className="hidden md:block"> <h1 className="text-2xl font-semibold text-gray-800">{activeNav}</h1> </div>
                    <div className="flex items-center space-x-3 ml-auto">
                        <span className="text-gray-700 font-medium hidden sm:inline text-sm"> {user ? user.name : '...'} </span>
                        <div className="bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase ring-2 ring-offset-2 ring-indigo-300"> {user ? user.initials : '?'} </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-50">
                    {renderActivePage()}
                </main>
            </div>
            {/* Modals can remain defined inline if needed */}
        </div>
    );
};

export default Dashboard;