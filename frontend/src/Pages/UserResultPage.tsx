import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// You can adjust totalQuestions to match your quiz!
const totalQuestions = 10;

const getResultFeedback = (score: number) => {
  if (score === totalQuestions) return "🎉 Perfect! You're a quiz master!";
  if (score >= totalQuestions * 0.8) return "Great job! 💪";
  if (score >= totalQuestions * 0.5) return "Not bad! Keep practicing!";
  return "Keep trying, you’ll get better! 🚀";
};

const getScoreColor = (score: number) => {
  if (score === totalQuestions) return "text-green-600";
  if (score >= totalQuestions * 0.8) return "text-green-500";
  if (score >= totalQuestions * 0.5) return "text-orange-400";
  return "text-red-500";
};

const UserResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score;

  useEffect(() => {
    if (score === undefined) {
      navigate("/user");
    }
  }, [score, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-blue-200 to-green-100">
      <div className="relative">
        <div className="animate-fadein bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl px-12 py-10 max-w-md w-full text-center border border-blue-100">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-16 h-16 text-yellow-400 drop-shadow animate-trophy"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 21h8m-4-5v5m0-5A7 7 0 0 1 5 9V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4a7 7 0 0 1-7 7z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow">Quiz Result</h2>
          <p className="text-gray-700 text-xl mb-2">
            You scored:
            <span className={`font-black mx-2 text-3xl ${getScoreColor(score)}`}>
              {score}
            </span>
            / {totalQuestions}
          </p>
          <div className="text-md text-gray-500 mb-6 font-semibold animate-pulse">
            {getResultFeedback(score)}
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-2 inline-block bg-gradient-to-r from-blue-600 to-blue-400 shadow-xl text-white px-8 py-2.5 rounded-lg font-bold text-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition"
          >
            Go to Home
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadein {
          animation: fadein 0.8s cubic-bezier(0.6,0.7,0.4,1.1);
        }
        @keyframes trophy-bounce {
          0%,100%{transform:translateY(0);}
          40%{transform:translateY(-10px);}
          60%{transform:translateY(-4px);}
        }
        .animate-trophy { animation: trophy-bounce 1.6s infinite; }
      `}</style>
    </div>
  );
};

export default UserResultPage;
