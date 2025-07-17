import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { registerAPI } from "../Services/AuthService";

const CODE_VALIDITY_MINUTES = 5;
const EMAILJS_SERVICE_ID = "service_zrte4j7";
const EMAILJS_TEMPLATE_ID = "template_2bv9j6o";
const EMAILJS_PUBLIC_KEY = "IZWtx00ksj409SaD6";
const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Bootcamp/Certification",
  "Other"
];

const Signup = () => {
  const [step, setStep] = useState<"form" | "code">("form");

  // Registration fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [specialty, setSpecialty] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [technologiesKnown, setTechnologiesKnown] = useState("");
  const [certifications, setCertifications] = useState("");
  const [learningGoals, setLearningGoals] = useState("");

  // Code and error handling
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
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
    if (!fullName.trim()) return setErrors(["Full name is required."]);
    if (!educationLevel.trim()) return setErrors(["Education level is required."]);
    if (yearsOfExperience === "" || isNaN(Number(yearsOfExperience))) return setErrors(["Years of experience required."]);
    if (!specialty.trim()) return setErrors(["Specialty is required."]);
    if (!currentRole.trim()) return setErrors(["Current role is required."]);
    if (age === "" || isNaN(Number(age))) return setErrors(["Age is required."]);
    if (!country.trim()) return setErrors(["Country is required."]);
    if (!preferredLanguage.trim()) return setErrors(["Preferred language is required."]);
    if (!technologiesKnown.trim()) return setErrors(["Technologies known is required."]);
    // certifications and learningGoals can be empty

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
      await registerAPI(
        email,
        username,
        password,
        fullName,
        educationLevel,
        Number(yearsOfExperience),
        specialty,
        currentRole,
        Number(age),
        country,
        preferredLanguage,
        technologiesKnown,
        certifications,
        learningGoals
      );
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
      <div className="absolute -bottom-36 -right-36 w-[400px] h-[400px] bg-green-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md z-10 border border-green-100 relative">
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-2 shadow">
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
            <input type="email" placeholder="Email" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="Username" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="password" placeholder="Repeat Password" className="w-full mb-4 px-4 py-2 border border-green-200 rounded-lg" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

            {/* User Profile Fields */}
            <input type="text" placeholder="Full Name" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={fullName} onChange={e => setFullName(e.target.value)} />
            <select
              className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg"
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
            >
              <option value="">Select Education Level</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <input type="number" placeholder="Years of Experience" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={yearsOfExperience} onChange={e => setYearsOfExperience(e.target.value === "" ? "" : Number(e.target.value))} />
            <input type="text" placeholder="Specialty (e.g. Frontend, Backend...)" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={specialty} onChange={e => setSpecialty(e.target.value)} />
            <input type="text" placeholder="Current Role (e.g. Student, Junior Developer)" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={currentRole} onChange={e => setCurrentRole(e.target.value)} />
            <input type="number" placeholder="Age" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={age} onChange={e => setAge(e.target.value === "" ? "" : Number(e.target.value))} />
            <input type="text" placeholder="Country" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={country} onChange={e => setCountry(e.target.value)} />
            <input type="text" placeholder="Preferred Language" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} />
            <input type="text" placeholder="Technologies Known (comma-separated)" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={technologiesKnown} onChange={e => setTechnologiesKnown(e.target.value)} />
            <input type="text" placeholder="Certifications (optional)" className="w-full mb-3 px-4 py-2 border border-green-200 rounded-lg" value={certifications} onChange={e => setCertifications(e.target.value)} />
            <input type="text" placeholder="Learning Goals (optional)" className="w-full mb-6 px-4 py-2 border border-green-200 rounded-lg" value={learningGoals} onChange={e => setLearningGoals(e.target.value)} />

            <button onClick={startCodeStep} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition text-lg">
              Register
            </button>
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account?</span>
              <button onClick={() => navigate("/login")} className="ml-2 text-blue-600 hover:underline font-semibold">
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
            <input type="text" placeholder="Enter verification code" maxLength={6} className="w-full mb-4 px-4 py-2 border border-blue-300 rounded-lg tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={code} onChange={(e) => setCode(e.target.value)} disabled={timer <= 0} />
            <button onClick={handleVerifyAndRegister} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition text-lg mb-2" disabled={timer <= 0}>
              Verify & Register
            </button>
            <button onClick={handleResend} className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-blue-100 transition mb-1" disabled={timer > 0}>
              Resend Code
            </button>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Wrong email?</span>
              <button onClick={() => setStep("form")} className="ml-2 text-blue-600 hover:underline font-semibold">
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
