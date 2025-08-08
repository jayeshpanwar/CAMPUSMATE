import { useEffect, useState } from 'react';

function FacultyLogin() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center px-8 py-12 gap-16 overflow-hidden">
      {/* Faculty Illustration */}
      <img
        src="./public/faculty.png"
        alt="Faculty Illustration"
        className={`w-80 h-80 object-contain rounded-xl shadow-lg transition-all duration-1000 ease-out ${animate ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
      />

      {/* Login Form */}
      <div className={`w-full max-w-md space-y-6 transition-all duration-1000 ease-out ${animate ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
        <h1 className="text-4xl font-bold text-gray-800">Faculty Login</h1>
        <input
          type="email"
          placeholder="Enter your faculty email ID"
          className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Your Password..."
          className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-right text-sm text-blue-500 cursor-pointer hover:underline">Forgot Password?</div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md">
          Sign In
        </button>
        <div className="text-center text-sm text-gray-600">
          No account yet? <span className="text-blue-600 cursor-pointer hover:underline">Sign Up</span>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;
