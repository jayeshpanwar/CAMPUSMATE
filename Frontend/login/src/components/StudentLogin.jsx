import { useEffect, useState } from "react";

function StudentLogin() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-12 gap-16 bg-white">
      
      {/* 👇 Left Image with pop-up animation 👇 */}
      <img
        src="./public/student.png"
        alt="Student Illustration"
        className={`w-80 h-80 object-contain rounded-xl shadow-lg transform transition duration-700 ease-out 
          ${animate ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-50'}
        `}
      />

      {/* 👇 Right Login Form 👇 */}
      <div
        className={`w-full max-w-md space-y-6 transform transition duration-700 ease-out 
          ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
        `}
      >
        <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>

        <input
          type="email"
          placeholder="Enter your college email ID"
          className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Your Password..."
          className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="text-right text-sm text-blue-500 cursor-pointer hover:underline">
          Forgot Password?
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md">
          Sign In
        </button>

        <div className="text-center text-sm text-gray-600">
          No account yet?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Sign Up</span>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
