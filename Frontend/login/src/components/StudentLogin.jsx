import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from './api.js'; 

// Removed the image import

function StudentLogin({ onSwitch }) {
    const [animate, setAnimate] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);

        if (selectedRole === "student" && window.location.pathname !== "/student/login") navigate("/student/login");
        else if (selectedRole === "faculty" && window.location.pathname !== "/faculty/login") navigate("/faculty/login");
        else if (selectedRole === "admin" && window.location.pathname !== "/admin/login") navigate("/admin/login");
    };

    // --- UPDATED handleSubmit with DEBUGGING ---
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const usernameInput = formData.username.trim(); // Still collect from the input field
      const passwordInput = formData.password.trim();

      if (!usernameInput || !passwordInput) {
          setError("Username/Email and password are required.");
          setLoading(false);
          return;
      }

      // --- CRITICAL FIX: Change the key name ---
      const loginData = {
          email: usernameInput, // Send the input value using the 'email' key
          password: passwordInput,
      };
      // ----------------------------------------

      console.log("Attempting to send login data:", loginData); // Debug log

      try {
          // This POST request now sends {email: ..., password: ...}
          const response = await api.post('login/', loginData); 
          
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          
          console.log("Login successful! Tokens received.");
          
          navigate("/dashboard");
      } catch (err) {
          console.error("Login failed:", err);
          
          let errorMsg = "Login failed. Check server connection or try again.";
          if (err.response) {
               if (err.response.status === 401) { 
                   errorMsg = "Invalid email or password. Please check your credentials."; // Updated message for 401
               } else if (err.response.status === 400 && err.response.data) {
                   const responseData = err.response.data;
                   // Display specific errors if Django sends them back
                   if (responseData.detail) {
                       errorMsg = `Login Error: ${responseData.detail}`;
                   } else if (responseData.email) {
                       errorMsg = `Email Error: ${responseData.email[0]}`;
                   } else if (responseData.password) {
                        errorMsg = `Password Error: ${responseData.password[0]}`;
                   } else {
                       errorMsg = "Login failed: Invalid data sent (400). Check console.";
                       console.error("Login 400 Response Data:", responseData);
                   }
               }
          }
           
          setError(errorMsg);
      } finally {
          setLoading(false);
      }
  };
    // --- END UPDATED handleSubmit ---

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
            
            {/* Fixed image path */}
            <img
                src="/Students.png" 
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

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 font-semibold rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <select
                    value={role}
                    onChange={handleRoleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-[#cdd8ff]"
                    disabled={loading}
                >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                </select>

                <input
                    type="text"
                    placeholder="Username or Email ID"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
                    required
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
                    required
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging In..." : "Login"}
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