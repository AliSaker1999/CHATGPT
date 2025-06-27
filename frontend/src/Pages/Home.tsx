import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 space-y-4">
      <h1 className="text-4xl font-bold text-gray-800">This is the Home Page</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
