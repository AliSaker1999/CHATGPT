import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { registerAPI } from "../Services/AuthService";

const CODE_VALIDITY_MINUTES = 5;
const EMAILJS_SERVICE_ID = "service_zrte4j7";
const EMAILJS_TEMPLATE_ID = "template_2bv9j6o";
const EMAILJS_PUBLIC_KEY = "IZWtx00ksj409SaD6";

const Signup = () => {
  const [step, setStep] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState(""); // user's input
  const [sentCode, setSentCode] = useState(""); // generated code
  const [timer, setTimer] = useState(CODE_VALIDITY_MINUTES * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "code" && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, timer]);

  const formatTimer = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const sendCodeToEmail = async (toEmail: string, code: string) => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          email: toEmail,
          passcode: code,
          time: `${CODE_VALIDITY_MINUTES} minutes`,
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (err) {
      throw new Error("Failed to send verification code. Please try again.");
    }
  };

  const startCodeStep = async () => {
    setErrors([]);
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) return setErrors(["Invalid email address."]);
    if (!username.trim()) return setErrors(["Username required."]);
    if (password.length < 6) return setErrors(["Password must be at least 6 characters."]);
    if (password !== confirmPassword) return setErrors(["Passwords do not match."]);
    const genCode = generateCode();
    setSentCode(genCode);
    setTimer(CODE_VALIDITY_MINUTES * 60);
    setStep("code");
    try {
      await sendCodeToEmail(email, genCode);
      alert('Verification code sent! Check your email.');
    } catch (e: any) {
      setErrors([e.message || "Failed to send code."]);
      setStep("form");
      return;
    }
  };

  const handleVerifyAndRegister = async () => {
    setErrors([]);
    if (timer <= 0) return setErrors(["Code expired."]);
    if (code !== sentCode) return setErrors(["Incorrect code."]);
    try {
      await registerAPI(email, username, password);
      setSuccess("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setErrors(Array.isArray(err) ? err : [err?.toString() || "Registration failed"]);
    }
  };

  const handleResend = async () => {
    setErrors([]);
    const genCode = generateCode();
    setSentCode(genCode);
    setTimer(CODE_VALIDITY_MINUTES * 60);
    try {
      await sendCodeToEmail(email, genCode);
    } catch (e: any) {
      setErrors([e.message || "Failed to resend code."]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Decorative blob */}
      <div className="absolute -bottom-36 -right-36 w-[400px] h-[400px] bg-green-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md z-10 border border-green-100 relative">
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-2 shadow">
            {/* User add icon */}
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 16v6M16 20h-8" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-green-700">Sign Up</h2>
          <p className="text-gray-400 text-sm mt-1">Create your Quizify account for free!</p>
        </div>
        {errors.length > 0 && (
          <ul className="mb-4 text-red-600 text-center font-semibold space-y-1">
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center font-semibold bg-green-100 rounded px-4 py-2 shadow">
            {success}
          </div>
        )}

        {step === "form" && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Repeat Password"
              className="w-full mb-6 px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={startCodeStep}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition text-lg"
            >
              Register
            </button>
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account?</span>
              <button
                onClick={() => navigate("/login")}
                className="ml-2 text-blue-600 hover:underline font-semibold"
              >
                Login
              </button>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <p className="mb-2 text-gray-700 text-center">
              A verification code was sent to <span className="font-semibold">{email}</span>.<br />
              Enter it below (expires in <span className="font-mono">{formatTimer(timer)}</span>).
            </p>
            <input
              type="text"
              placeholder="Enter verification code"
              maxLength={6}
              className="w-full mb-4 px-4 py-2 border border-blue-300 rounded-lg tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={timer <= 0}
            />
            <button
              onClick={handleVerifyAndRegister}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition text-lg mb-2"
              disabled={timer <= 0}
            >
              Verify & Register
            </button>
            <button
              onClick={handleResend}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-blue-100 transition mb-1"
              disabled={timer > 0}
            >
              Resend Code
            </button>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Wrong email?</span>
              <button
                onClick={() => setStep("form")}
                className="ml-2 text-blue-600 hover:underline font-semibold"
              >
                Start Over
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
