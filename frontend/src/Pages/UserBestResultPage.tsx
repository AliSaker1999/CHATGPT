import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getResultsByUsername } from "../Services/ResultService";
import { QuizResultDto } from "../Models/QuizResult";

const UserBestResultPage = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<QuizResultDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!user) return;

      const results = await getResultsByUsername(user.userName); // should return array
      if (results) {
        setResult(results[0]);
      } else {
        setResult(null);
      }
      setLoading(false);
    };

    fetchResult();
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-2xl text-red-700 font-bold">Unauthorized</div>
    </div>
  );
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-blue-700 font-semibold text-xl">Loading your result...</div>
    </div>
  );

  if (!result) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
      <div className="bg-white/90 shadow-2xl p-10 rounded-2xl max-w-lg w-full text-center border border-blue-100">
        <h2 className="text-2xl font-bold text-red-700 mb-3">No quiz result found.</h2>
        <p className="text-gray-500">You haven’t completed the quiz yet.</p>
      </div>
    </div>
  );

  // Color score based on value
  const scoreColor =
    result.score >= 8 ? "text-green-600"
      : result.score >= 5 ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-green-100">
      <div className="animate-fadein bg-white/90 shadow-2xl rounded-2xl px-10 py-8 max-w-md w-full text-center border border-blue-100">
        {/* Trophy icon */}
        <div className="flex justify-center mb-3">
          <svg
            className="w-14 h-14 text-yellow-400 animate-trophy drop-shadow"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 21h8m-4-5v5m0-5A7 7 0 0 1 5 9V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4a7 7 0 0 1-7 7z"/>
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2">You Already Took The Quiz</h2>
        <p className="mb-5 text-gray-500 italic">
          Only your first result counts. Keep learning!
        </p>
        <div className="space-y-4 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-6 shadow-inner">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Username:</span>
            <span className="text-blue-700 font-bold">{result.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-600">{result.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Score:</span>
            <span className={`font-bold ${scoreColor}`}>{result.score}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-500">{new Date(result.submittedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadein { animation: fadein 0.8s cubic-bezier(.7,1.4,.8,1.0); }
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

export default UserBestResultPage;
