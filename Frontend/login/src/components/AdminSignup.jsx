import { useEffect, useState } from "react";

function AdminSignup({ onSwitch }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => setAnimate(true), []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      
      {/* Left Illustration */}
      <img
        src="/AdminSignup.png"
        alt="Admin Signup Illustration"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-contain transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />

      {/* Right Form */}
      <div
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Create Admin Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none text-sm"
        />
        <input
          type="email"
          placeholder="Admin Email ID"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none text-sm"
        />
        <input
          type="password"
          placeholder="Create Password"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none text-sm"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none text-sm"
        />

        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-medium transition">
          Sign Up
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-gray-900 font-medium hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
