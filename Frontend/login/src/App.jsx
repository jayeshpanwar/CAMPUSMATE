import { useState, useEffect, useRef } from "react";
import StudentLogin from "./components/StudentLogin";
import FacultyLogin from "./components/FacultyLogin";
import AdminLogin from "./components/AdminLogin";
import StudentSignup from "./components/StudentSignup";
import FacultySignup from "./components/FacultySignup";
import AdminSignup from "./components/AdminSignup";

function App() {
  const [role, setRole] = useState("student");
  const [view, setView] = useState("login");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { value: "student", label: "🎓 Student" },
    { value: "faculty", label: "👨‍🏫 Faculty" },
    { value: "admin", label: "🛠️ Admin" },
  ];

  const handleSelect = (value) => {
    setRole(value);
    setView("login");
    setIsOpen(false);
  };

  const switchToSignup = (selectedRole) => {
    setRole(selectedRole);
    setView("signup");
  };

  const switchToLogin = (selectedRole) => {
    setRole(selectedRole);
    setView("login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f6ff] to-[#ffffff] flex flex-col relative font-poppins">
      {/* Dropdown */}
      <div className="absolute top-4 right-4 z-20" ref={dropdownRef}>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.find((r) => r.value === role)?.label || "Select Role"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transform transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-900 rounded-xl shadow-lg transition-all duration-200 ease-out">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleSelect(r.value)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-white transition-all rounded-md"
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
        {role === "student" &&
          (view === "login" ? (
            <StudentLogin onSwitch={() => switchToSignup("student")} />
          ) : (
            <StudentSignup onSwitch={() => switchToLogin("student")} />
          ))}

        {role === "faculty" &&
          (view === "login" ? (
            <FacultyLogin onSwitch={() => switchToSignup("faculty")} />
          ) : (
            <FacultySignup onSwitch={() => switchToLogin("faculty")} />
          ))}

        {role === "admin" &&
          (view === "login" ? (
            <AdminLogin onSwitch={() => switchToSignup("admin")} />
          ) : (
            <AdminSignup onSwitch={() => switchToLogin("admin")} />
          ))}
      </div>
    </div>
  );
}

export default App;
