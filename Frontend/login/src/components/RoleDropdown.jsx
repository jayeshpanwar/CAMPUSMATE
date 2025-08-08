import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react"; // Optional: use heroicons or lucide-react

const RoleDropdown = () => {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="relative w-fit text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-semibold text-lg px-4 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
      >
        {currentRole}
        <ChevronDown className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-dropdown"
        >
          <div className="py-1">
            {roles.map((role) => (
              <button
                key={role.name}
                onClick={() => handleSelect(role.path)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentRole === role.name ? "font-bold" : ""
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDropdown;
