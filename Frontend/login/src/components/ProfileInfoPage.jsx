import React from 'react';

// You might need icons here if this page uses them directly
// const SomeIcon = ({ className }) => ( /* ... SVG ... */ );

const ProfileInfoPage = ({ user, attendance, cgpa, sgpa, handleGenerateStudyPlan, isGeneratingPlan }) => {
    console.log("Rendering: ProfileInfoPage Component"); // Add log
    // Basic check for essential prop
    if (!user) {
        return <div className="p-4 text-red-500">Error: User data not available for profile page.</div>;
    }
    // Check if sgpa is a valid object before trying to use Object.entries
    const sgpaEntries = sgpa && typeof sgpa === 'object' ? Object.entries(sgpa) : [];

    return (
        <div className="space-y-8">
            {/* Main Student Info Card */}
            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="bg-white text-indigo-600 rounded-full h-20 w-20 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-md">
                    {/* Display role dynamically */}
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 w-full text-center sm:text-left">
                    <div>
                        <p className="font-bold text-xl">{user.name || 'N/A'}</p>
                        <p className="text-sm text-indigo-200">Enrollment: {user.enrollment || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-indigo-200 break-words">{user.email || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2 md:col-span-1"> {/* Adjust column span for better layout */}
                        <p className="font-semibold">Contact</p>
                        <p className="text-sm text-indigo-200">{user.contact || 'N/A'}</p>
                    </div>
                </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Academic Details */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 col-span-1 md:col-span-2 lg:col-span-1">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">Academic Details</h3>
                    <div className="flex items-baseline space-x-2 mb-4">
                        <p className="text-5xl font-bold text-indigo-600">{cgpa || 'N/A'}</p>
                        <span className="text-gray-500 font-medium">CGPA</span>
                    </div>
                    <h4 className="font-semibold text-gray-600 mb-2 text-sm">Semester Performance (SGPA)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600">
                        {sgpaEntries.length > 0 ? (
                            sgpaEntries.map(([sem, gpa]) => (
                                <p key={sem}>
                                    <span className="font-semibold text-gray-800">{sem}:</span> {gpa}
                                </p>
                            ))
                        ) : (
                            <p className="col-span-full text-gray-500">SGPA data unavailable.</p>
                        )}
                    </div>
                </div>
                 {/* Attendance */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-lg text-gray-700">Attendance</h3>
                    <p className="text-6xl font-bold text-green-500 my-3">{attendance || 'N/A'}</p>
                    <p className="text-gray-500 text-xs">Last updated: Today</p> {/* Example static text */}
                </div>
                 {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleGenerateStudyPlan}
                            disabled={isGeneratingPlan}
                            className="w-full text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold p-3 rounded-lg transition duration-200 ease-in-out text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isGeneratingPlan ? 'Generating Plan...' : '✨ Generate Study Plan'}
                        </button>
                        <button className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium p-3 rounded-lg transition duration-200 ease-in-out text-sm">
                            View Mid Semester Marks
                        </button>
                        <button className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium p-3 rounded-lg transition duration-200 ease-in-out text-sm">
                            Download Fee Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfoPage;