import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "/public/Students.png";
import { loginUser } from "./api"; // ✅ Import the API function

function StudentLogin({ onSwitch }) {
  const [animate, setAnimate] = useState(false);
  // ✅ Changed: use email instead of username
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "student") navigate("/student/login");
    else if (selectedRole === "faculty") navigate("/faculty/login");
    else if (selectedRole === "admin") navigate("/admin/login");
  };

  // ✅ Updated login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Changed username → email
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // ✅ Save JWT tokens
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError("Login failed. Please check your email and password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      {/* Left-side Image */}
      <img
        src={myImage}
        alt="Student Login"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
        style={{ display: "block" }}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Student Login
        </h1>

        {/* Dropdown for role switch */}
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-[#cdd8ff]"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>

        {/* ✅ Changed to Email Input */}
        <input
          type="email"
          placeholder="Email"
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
          className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm text-gray-700 border-none">
          Don’t have an account?{" "}
          <span
            onClick={onSwitch}
            className="font-semibold text-gray-500 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

export default StudentLogin;
