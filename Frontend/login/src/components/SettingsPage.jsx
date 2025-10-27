import React from 'react';

const SettingsPage = () => {
    console.log("Rendering: SettingsPage Component"); // Add log
    return (
        <div className="p-8 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-2">User profile settings and preferences will go here.</p>
            {/* Add settings form elements */}
        </div>
    );
};

export default SettingsPage;