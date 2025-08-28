import { useState, useRef, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function AuthPage() {
  const [role, setRole] = useState("student");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const roles = [
    { value: "student", label: "Student" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
  ];

  const handleSelect = (value) => {
    setRole(value);
    setIsOpen(false);
    navigate(`/${value}/login`);
  };

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
    <div className="relative min-h-screen bg-gray-50 font-poppins">
      {/* Dropdown: always top-right */}
      <div className="absolute top-4 right-4 z-50" ref={dropdownRef}>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg font-medium"
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
            <div className="absolute right-0 mt-2 w-44 bg-gray-900 rounded-xl shadow-lg">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleSelect(r.value)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-white rounded-md"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outlet for rendering login/signup routes */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
