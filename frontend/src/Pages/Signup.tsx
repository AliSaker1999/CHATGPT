import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../Services/AuthService";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const result = await registerAPI(email, username, password);
    if (result) {
      alert("Signup successful! Please login.");
      navigate("/login"); // ✅ redirect to login
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-3 py-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-3 py-2 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-3 py-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Signup;
