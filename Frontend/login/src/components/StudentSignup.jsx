import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "/public/Students.png";
import { registerStudent } from "./api";

function StudentSignup({ onSwitch }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ States for loading, error, and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ Clear previous messages on new submission
    setError("");
    setSuccess("");
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
      await registerStudent(userData);
      // ✅ Set success message and clear the form
      setSuccess("Signup completed! Redirecting to login...");
      setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/student/login");
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const firstErrorKey = Object.keys(errorData)[0];
        // ✅ Set a user-friendly failure message
        setError(`Signup failed: ${errorData[firstErrorKey][0]}`);
      } else {
        setError("Signup failed. An unknown error occurred.");
      }
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      {/* Left-side Image */}
      <img
        src={myImage}
        alt="Student Signup"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Student Account
        </h1>

        {/* --- Form Inputs --- */}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
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
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />

        {/* ✅ Status Message Display Area */}
        <div className="text-center text-sm h-5">
          {success && <p className="text-green-600 font-semibold">{success}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center text-sm text-gray-700 border-none">
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

export default StudentSignup;