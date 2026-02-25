import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import studentImage from "/public/Students.png";
import { loginUser } from "./api";

function StudentLogin({ onSwitch }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student"); // Added role state

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Added handleRoleChange to match FacultyLogin behavior
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole === "student") {
      navigate("/student/login");
    } else if (selectedRole === "faculty") {
      navigate("/faculty/login");
    } else if (selectedRole === "admin") {
      navigate("/admin/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email: formData.email, password: formData.password });
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_email', response.data.email);
        localStorage.setItem('user_role', response.data.role);
        localStorage.setItem('user_name', response.data.first_name);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      <img
        src="/Students.png"
        alt="Student Login"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Student Login
        </h1>

        <div className="space-y-4">
          {/* Added Dropdown Menu */}
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-[#cdd8ff]"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm min-h-5">
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>

        <div className="text-center text-sm text-gray-700 border-none">
          Don't have an account?
          <span
            onClick={onSwitch}
            className="ml-1 font-semibold text-gray-500 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

export default StudentLogin;