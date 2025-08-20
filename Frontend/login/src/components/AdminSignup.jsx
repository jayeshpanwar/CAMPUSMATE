import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // custom icons

function AdminSignup({ onSwitch }) {
  const [animate, setAnimate] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen items-center justify-center font-poppins bg-white overflow-hidden px-6">
      {/* Left Image */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-700 ease-out ${
          animate
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-6 scale-95"
        }`}
      >
        <img
          src="/user.png"
          alt="Admin Signup Illustration"
          className="w-40 sm:w-56 md:w-72 lg:w-80 h-auto object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Right Form */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-700 ease-out ${
          animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
        }`}
      >
        <div className="w-full max-w-md bg-white space-y-6 px-6 py-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center md:text-left">
            Create Admin Account
          </h1>

          <div className="space-y-4">
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 
                placeholder-[#4F6EF7] focus:outline-none focus:ring-2 
                focus:ring-[#cdd8ff] border-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Admin Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 
                placeholder-[#4F6EF7] focus:outline-none focus:ring-2 
                focus:ring-[#cdd8ff] border-none"
            />

            {/* Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f0f8ff] text-gray-700 
                  placeholder-[#4F6EF7] focus:outline-none focus:ring-2 
                  focus:ring-[#cdd8ff] border-none
                  [&::-ms-reveal]:hidden [&::-ms-clear]:hidden 
                  [&::-webkit-credentials-auto-fill-button]:hidden 
                  [&::-webkit-clear-button]:hidden 
                  [&::-webkit-password-toggle-button]:hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password with toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f0f8ff] text-gray-700 
                  placeholder-[#4F6EF7] focus:outline-none focus:ring-2 
                  focus:ring-[#cdd8ff] border-none
                  [&::-ms-reveal]:hidden [&::-ms-clear]:hidden 
                  [&::-webkit-credentials-auto-fill-button]:hidden 
                  [&::-webkit-clear-button]:hidden 
                  [&::-webkit-password-toggle-button]:hidden"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none">
            Sign Up
          </button>

          {/* Switch to Login */}
          <div className="text-center text-sm text-gray-700">
            Already have an account?{" "}
            <span
              onClick={() => onSwitch("adminLogin")}
              className="font-semibold text-gray-500 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
