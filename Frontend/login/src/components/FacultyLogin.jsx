import { useEffect, useState } from "react";

function FacultyLogin({ onSwitch }) {
  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center font-poppins bg-white overflow-hidden px-6">
      
      {/* Left Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/Faculty.png"
          alt="Faculty Illustration"
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome Back, Faculty!</h1>

          <div className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your faculty email id"
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
              style={{ border: "none" }}
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password..."
                className="w-full px-4 py-3 pr-10 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
                style={{ border: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.37-4.394m1.698-1.698A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.16 5.12M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Forgot Password?
          </div>

          <button className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none">
            Sign In
          </button>

          <div
            className="text-center text-sm text-gray-700"
            style={{ border: "none", boxShadow: "none", outline: "none" }}
          >
            No account yet?{" "}
            <span
              onClick={() => onSwitch("facultySignup")}
              className="font-semibold text-gray-500 cursor-pointer hover:underline"
              style={{ border: "none", boxShadow: "none", outline: "none" }}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;
