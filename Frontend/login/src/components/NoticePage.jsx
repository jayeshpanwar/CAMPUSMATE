import React from 'react';

// Placeholder data - replace with data fetched from your backend API later
const noticesData = [
    { id: 1, title: "Mid-Semester Exam Schedule", content: "The schedule for the upcoming mid-semester exams has been released. Please check the examination portal for details.", posted: "2 hours ago", type: "exam" },
    { id: 2, title: "Library Closure", content: "The central library will be closed this Saturday for maintenance.", posted: "1 day ago", type: "general" },
    { id: 3, title: "Guest Lecture: AI in Healthcare", content: "Dr. Anya Sharma will be delivering a guest lecture on Friday at 3 PM in the Seminar Hall.", posted: "3 days ago", type: "event" },
];

const getNoticeStyle = (type) => {
    switch (type) {
        case 'exam': return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800', accent: 'text-red-700', time: 'text-red-500' };
        case 'event': return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', accent: 'text-green-700', time: 'text-green-500' };
        default: return { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800', accent: 'text-blue-700', time: 'text-blue-500' };
    }
};

const NoticePage = () => {
    console.log("Rendering: NoticePage Component"); // Add log
    return (
        <div className="p-4 md:p-0">
            {/* Title is handled by the main Dashboard header */}
            <div className="space-y-4">
                {noticesData.length > 0 ? (
                    noticesData.map(notice => {
                        const style = getNoticeStyle(notice.type);
                        return (
                            <div key={notice.id} className={`p-4 rounded-r-lg border-l-4 ${style.border} ${style.bg} shadow-sm`}>
                                <h3 className={`font-semibold ${style.text}`}>{notice.title}</h3>
                                <p className={`text-sm ${style.accent} mt-1`}>{notice.content}</p>
                                <p className={`text-xs ${style.time} mt-2`}>Posted: {notice.posted}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center mt-10">No recent notices or updates.</p>
                )}
            </div>
        </div>
    );
};

export default NoticePage;