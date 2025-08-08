import { useState } from 'react';
import StudentLogin from './components/StudentLogin';
import FacultyLogin from './components/FacultyLogin';
import AdminLogin from './components/AdminLogin';

function App() {
  const [role, setRole] = useState('student');
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { value: 'student', label: '🎓 Student' },
    { value: 'faculty', label: '👨‍🏫 Faculty' },
    { value: 'admin', label: '🛠️ Admin' },
  ];

  const handleSelect = (value) => {
    setRole(value);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f6ff] to-[#ffffff] flex flex-col relative font-poppins">
      
      {/* Custom Dropdown */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white text-gray-800 text-sm rounded-xl shadow-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 font-medium"
          >
            {roles.find(r => r.value === role).label} ⌄
          </button>

          {/* Dropdown List */}
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg transition-all duration-300 transform animate-fadeIn"
            >
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleSelect(r.value)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-all rounded-md"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role-based Component */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-10">
        {role === 'student' && <StudentLogin />}
        {role === 'faculty' && <FacultyLogin />}
        {role === 'admin' && <AdminLogin />}
      </div>
    </div>
  );
}

export default App;
