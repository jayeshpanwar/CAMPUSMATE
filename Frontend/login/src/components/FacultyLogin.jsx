import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";
// import facultyImage from "/public/Faculty.png";

function FacultyLogin({ onSwitch }) {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("faculty");
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email: formData.email, password: formData.password });
      if (response.data.access) {
        // Clear all old user data first
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_department');
        localStorage.removeItem('user_enrollment');
        
        // Set new user data
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_email', response.data.email);
        localStorage.setItem('user_role', response.data.role);
        // Combine first and last name for faculty
        const fullName = `${response.data.first_name} ${response.data.last_name || ''}`.trim();
        localStorage.setItem('user_name', fullName);
        localStorage.setItem('user_department', response.data.department || "");
        navigate("/faculty/dashboard");
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
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-8 gap-12 md:gap-20 bg-white font-poppins">
      <img
        src="/Faculty.png"
        alt="Faculty Login"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Faculty Login
        </h1>
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
          placeholder="College Email ID"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <span onClick={onSwitch} className="font-semibold text-gray-500 cursor-pointer hover:underline">
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

export default FacultyLogin;