import { useEffect, useState } from "react";

function StudentSignup({ onSwitch }) {
  const [animate, setAnimate] = useState(false);

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
          src="/Students.png"
          alt="Student Illustration"
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
            Create Your Account
          </h1>

          <div className="space-y-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />

            {/* College Email */}
            <input
              type="email"
              placeholder="Enter your college email id"
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Create Password"
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />
          </div>

          {/* Sign up button */}
          <button className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none">
            Sign Up
          </button>

          {/* Switch to Login */}
          <div className="text-center text-sm text-gray-700">
            Already have an account?{" "}
            <span
              onClick={onSwitch}
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

export default StudentSignup;
