import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ 1. Import the correct function for faculty registration
import { registerFaculty } from "./api"; 

function FacultySignup({ onSwitch }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "", // Added department field
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      department: formData.department, // Include department in the data
      password: formData.password,
      password2: formData.confirmPassword,
    };

    try {
      // ✅ 2. Call the correct API function
      await registerFaculty(userData);
      alert("Faculty signup successful! Please proceed to login.");
      navigate("/faculty/login"); // Or a general login page
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
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Faculty Account
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
          placeholder="College Email ID"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]"
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

export default FacultySignup;