import React from 'react';

const SearchPage = () => {
    console.log("Rendering: SearchPage Component"); // Add log
    return (
        <div className="p-8 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">Search</h1>
            <p className="text-gray-500 mt-2">Search functionality will be implemented here.</p>
            {/* Add search input and results display */}
        </div>
    );
};

export default SearchPage;