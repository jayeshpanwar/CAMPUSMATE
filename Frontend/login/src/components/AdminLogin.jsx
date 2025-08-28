import { useEffect, useState } from "react";
import { loginUser } from "./api";
import { useNavigate } from "react-router-dom";  // ✅ import useNavigate

function AdminLogin({ onSwitch }) {
  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" }); // ✅ store values
  const navigate = useNavigate();  // ✅ initialize navigate

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await loginUser({
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      alert("Login successful!");
      navigate("/dashboard"); // ✅ redirect to dashboard after login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center font-poppins bg-white overflow-hidden px-6">
      {/* Left Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/account.png"
          alt="Admin Illustration"
          className={`w-64 sm:w-80 md:w-[28rem] h-auto object-contain transition-all duration-700 ease-out select-none ${
            animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"
          }`}
          draggable={false}
          style={{ border: "none", outline: "none", boxShadow: "none", backgroundColor: "transparent" }}
        />
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`w-full max-w-md bg-white z-20 space-y-6 px-6 py-8 rounded-2xl shadow-lg transition-all duration-700 ease-out ${
            animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
          style={{ border: "none", boxShadow: "none", outline: "none" }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome Back, Admin!</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your admin email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="text-right text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Forgot Password?
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-sm text-gray-700">
            No account yet?{" "}
            <span
              onClick={onSwitch}
              className="font-semibold text-gray-500 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
