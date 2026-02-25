import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import myImage from "/public/Students.png";
import { initiateStudentVerification, confirmStudentVerification, registerStudent } from "./api";

function StudentVerify({ onSwitch }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const email = formData.email.trim();
    if (!email) {
      setError("Institutional email is required.");
      return;
    }

    setLoading(true);
    try {
      // First try to register the student (for new accounts)
      try {
        await registerStudent({
          email: email,
          password: "temp_password_123", // Temporary password, will be set during verification
          password2: "temp_password_123", // Confirmation
          first_name: "Student", // Default values, can be updated later
          last_name: "User"
        });
        setMessage("Account created successfully. Sending verification code...");
      } catch (registerErr) {
        // If registration fails because account exists, that's okay - proceed with verification
        if (registerErr.response && registerErr.response.status !== 400) {
          throw registerErr; // Re-throw if it's not a "account exists" error
        }
        // If 400 error, account might already exist, continue with verification
      }

      // Now initiate verification (works for both new and existing accounts)
      await initiateStudentVerification({ email });
      setStep("verify");
      setMessage("Verification code sent. Check your institutional inbox.");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;

        // If backend returned a plain string (or HTML), handle gracefully
        if (typeof data === 'string') {
          const trimmed = data.trim();
          if (trimmed.startsWith('<')) {
            setError('Server error occurred. Check backend logs.');
          } else {
            setError(trimmed);
          }
        } else {
          const firstKey = Object.keys(data)[0];
          const value = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];

          // If account is already verified, redirect to login
          if (value === "Account is already verified. Try logging in.") {
            setError("Your account is already verified. Please log in instead.");
            setTimeout(() => {
              navigate("/student/login");
            }, 2000);
            return;
          }

          setError(typeof value === "string" ? value : "Failed to send verification code.");
        }
      } else {
        setError("Unable to send verification code. Try again later.");
      }
      console.error("Verification initiation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.otp.trim()) {
      setError("Enter the verification code from your email.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmStudentVerification({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        password: formData.password,
        password2: formData.confirmPassword,
      });

      setMessage("Account verified! Redirecting to login...");
      setTimeout(() => {
        navigate("/student/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          const trimmed = data.trim();
          if (trimmed.startsWith('<')) {
            setError('Server error occurred. Check backend logs.');
          } else {
            setError(trimmed);
          }
        } else {
          const firstKey = Object.keys(data)[0];
          const value = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          setError(typeof value === "string" ? value : "Verification failed.");
        }
      } else {
        setError("Verification failed. Try again.");
      }
      console.error("Verification confirmation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const renderRequestStep = () => (
    <>
      <p className="text-sm text-gray-600">
        Enter your institutional email to create an account or verify an existing one.
      </p>
      <input
        type="email"
        placeholder="Institutional Email ID"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400"
      >
        {loading ? "Sending Code..." : "Send Verification Code"}
      </button>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <p className="text-sm text-gray-600">
        Enter the code from your institutional inbox and set a new password for CampusMate.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="6-digit Verification Code"
          value={formData.otp}
          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          maxLength={6}
          required
        />
        <input
          type="password"
          placeholder="Create New Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff] text-gray-700 placeholder-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#cdd8ff] border-none"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4F6EF7] hover:bg-[#3D57D9] text-white py-3 rounded-xl text-lg font-semibold transition border-none disabled:bg-gray-400"
      >
        {loading ? "Verifying..." : "Verify & Activate"}
      </button>
      <button
        type="button"
        onClick={handleRequestOtp}
        disabled={loading}
        className="w-full text-[#4F6EF7] hover:text-[#3D57D9] font-semibold text-sm"
      >
        Resend Code
      </button>
      <button
        type="button"
        onClick={() => {
          setStep("request");
          setMessage("");
          setError("");
          setFormData({ email: "", otp: "", password: "", confirmPassword: "" });
        }}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
        disabled={loading}
      >
        Use a different email
      </button>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 sm:px-10 py-8 gap-12 md:gap-20 bg-white font-poppins">
      <img
        src="/Students.png"
        alt="Verify Student Account"
        className={`w-60 sm:w-80 md:w-[28rem] h-auto object-cover rounded-2xl transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-95"}`}
      />

      <form
        onSubmit={step === "request" ? handleRequestOtp : handleConfirm}
        className={`w-full max-w-md space-y-6 transition-all duration-700 ease-out 
          ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Verify Student Access
        </h1>

        <div className="space-y-4">
          {step === "verify" && (
            <div className="px-4 py-3 rounded-xl bg-[#eef2ff] text-[#3D57D9] text-sm">
              Verification code sent to <span className="font-semibold">{formData.email}</span>.
            </div>
          )}
          {step === "request" ? renderRequestStep() : renderVerifyStep()}
        </div>

        <div className="text-center text-sm min-h-5">
          {message && <p className="text-green-600 font-semibold">{message}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>

        <div className="text-center text-sm text-gray-700 border-none">
          Already verified?
          <span
            onClick={onSwitch}
            className="ml-1 font-semibold text-gray-500 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </div>
      </form>
    </div>
  );
}

export default StudentVerify;