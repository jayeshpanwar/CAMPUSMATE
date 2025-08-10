import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const RoleDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = location.pathname.includes("admin")
    ? "Admin"
    : location.pathname.includes("faculty")
    ? "Faculty"
    : "Student";

  const roles = [
    { name: "Student", path: "/login/student" },
    { name: "Faculty", path: "/login/faculty" },
    { name: "Admin", path: "/login/admin" },
  ];

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 font-poppins" ref={dropdownRef}>
      <div className="relative w-fit text-left">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-gray-800 text-base font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          {currentRole}
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-32 rounded-md shadow-sm bg-white border border-gray-200 animate-fadeInUp">
            {roles.map((role) => (
              <button
                key={role.name}
                onClick={() => handleSelect(role.path)}
                className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 transition ${
                  currentRole === role.name
                    ? "font-semibold text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleDropdown;
