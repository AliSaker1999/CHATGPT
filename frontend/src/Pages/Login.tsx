import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../Services/AuthService";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const userData = await loginAPI(username, password);
    if (!userData) {
      setError("Invalid username or password.");
      return;
    }
    login(userData);
    if (userData.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/quiz-redirect");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
      {/* Decorative blob */}
      <div className="absolute -top-28 -left-36 w-[400px] h-[400px] bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md z-10 border border-blue-100 relative">
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-full mb-2 shadow">
            {/* Lock icon */}
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <rect width="16" height="11" x="4" y="11" rx="2" />
              <path d="M8 11V7a4 4 0 118 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700">Login</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Please sign in to continue.</p>
        </div>
        {error && (
          <div className="text-red-600 text-center mb-4 font-semibold bg-red-50 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition text-lg"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don&apos;t have an account?</span>
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-green-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
