import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // custom icons

function FacultyLogin({ onSwitch }) {
  const [animate, setAnimate] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          src="/class.png"
          alt="Faculty Illustration"
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
            Welcome Back, Faculty!
          </h1>

          <div className="space-y-4">
            {/* Email */}
            <input
              type="email"
              placeholder="Enter your faculty email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] 
                focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
            />

            {/* Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] 
                  focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none
                  [&::-ms-reveal]:hidden [&::-ms-clear]:hidden 
                  [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-clear-button]:hidden 
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
          </div>

          {/* Forgot password */}
          <div className="text-right text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Forgot Password?
          </div>

          {/* Sign in */}
          <button className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none">
            Sign In
          </button>

          {/* Sign up */}
          <div className="text-center text-sm text-gray-700">
            No account yet?{" "}
            <span
              onClick={() => onSwitch("facultySignup")}
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

export default FacultyLogin;
