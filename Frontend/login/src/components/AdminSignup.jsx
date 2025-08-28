import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ 1. Import or define the path to your admin image
import adminImage from "/public/Admin.png"; 
import { registerAdmin } from "./api";

function AdminSignup({ onSwitch }) {
  const navigate = useNavigate();
  // ✅ 2. Add the animate state back
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 3. Add the useEffect to trigger the animation
  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const nameParts = formData.fullName.split(" ");
    const userData = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "",
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
    };

    try {
      await registerAdmin(userData);
      alert("Admin account created successfully! Please proceed to login.");
      navigate("/admin/login");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const firstErrorKey = Object.keys(errorData)[0];
        setError(`Signup failed: ${errorData[firstErrorKey][0]}`);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      {/* ✅ 4. Add the <img> tag back with animation classes */}
      <img
        src={adminImage}
        alt="Admin Signup"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
        ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Admin Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]"
          required
        />
        <input
          type="email"
          placeholder="Admin Email ID"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]"
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]"
          required
        />

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <span
            onClick={onSwitch}
            className="font-semibold text-gray-500 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </div>
      </form>
    </div>
  );
}

export default AdminSignup;