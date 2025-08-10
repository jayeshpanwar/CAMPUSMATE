import { useEffect, useState } from "react";
import myImage from "/public/Student.png"; // Place your image in src/assets/

function StudentSignup({ onSwitch }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      
      {/* Left-side Image */}
      <img
        src="/Student.png"
        alt="Student Signup"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
        style={{ display: "block" }} // prevents any extra bottom gap
      />

      {/* Form */}
      <div
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Student Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
        />
        <input
          type="email"
          placeholder="College Email ID"
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
        />
        <input
          type="password"
          placeholder="Create Password"
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
        />

        <button className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none">
          Sign Up
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
      </div>
    </div>
  );
}

export default StudentSignup;
