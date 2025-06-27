import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score;

  useEffect(() => {
    if (score === undefined) {
      // Prevent manual access
      navigate("/user");
    }
  }, [score, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg p-8 rounded-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Quiz Result</h2>
        <p className="text-gray-700 text-xl mb-6">
          You scored: <span className="font-bold text-green-600">{score}</span> / 10
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UserResultPage;
