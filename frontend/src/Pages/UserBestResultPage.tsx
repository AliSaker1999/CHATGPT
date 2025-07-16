import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getResultsByUsername } from "../Services/ResultService";
import { QuizResultDto } from "../Models/QuizResult";
import { getMyRetakeRequests, submitRetakeRequest } from "../Services/quizRetakeRequestService"; // YOU add this

interface QuizRetakeRequestDto {
  id: number;
  userName: string;
  email: string;
  message: string;
  requestedAt: string;
  isApproved: boolean | null;
  decisionAt: string | null;
}

const UserBestResultPage = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<QuizResultDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Retake request state
  const [pendingRequest, setPendingRequest] = useState<QuizRetakeRequestDto | null>(null);
  const [checkingPending, setCheckingPending] = useState(true);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  useEffect(() => {
    const fetchResultAndRequests = async () => {
      if (!user) return;

      const results = await getResultsByUsername(user.userName); // You can modify this as needed
      setResult(results?.[0] || null);
      setLoading(false);

      setCheckingPending(true);
      try {
        // Call your service here:
        const myRequests = await getMyRetakeRequests(user.token);
        const pending = myRequests.find(r => r.isApproved === null);
        setPendingRequest(pending || null);

        // TEMP: for development, simulate no pending
        setPendingRequest(null); // REMOVE when you add your service!
      } catch {
        setPendingRequest(null);
      }
      setCheckingPending(false);
    };

    fetchResultAndRequests();
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

        {/* Retake request logic */}
        {checkingPending ? (
          <div className="mt-6 text-blue-600">Checking for pending requests...</div>
        ) : pendingRequest ? (
          <div className="mt-8 w-full max-w-md mx-auto">
            <div className="bg-yellow-100 border border-yellow-300 rounded-2xl px-7 py-6 text-center shadow font-semibold text-yellow-900">
              <span role="img" aria-label="Pending" className="text-2xl">🕓</span>
              <div className="mt-1">
                You have requested a retake.<br />
                Please wait for admin approval.
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 w-full max-w-md mx-auto">
            <div className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 px-7 py-6 text-left">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Want another chance?</h3>
              <p className="mb-3 text-gray-600 text-sm">
                You can request another attempt. The admin will review your request.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!requestMessage.trim()) {
                    setRequestError("Please enter a message.");
                    return;
                  }
                  setRequestLoading(true);
                  setRequestError("");
                  setRequestSuccess("");
                  try {
                    await submitRetakeRequest({ message: requestMessage }, user.token);
                    setRequestSuccess("Request sent! Please wait for admin approval.");
                    setRequestMessage("");
                    setPendingRequest({ id: -1, userName: user.userName, email: "", message: requestMessage, requestedAt: new Date().toISOString(), isApproved: null, decisionAt: null });
                  } catch (err: any) {
                    setRequestError(
                      err.response?.data ||
                        "Could not send request. You might already have a pending one."
                    );
                  } finally {
                    setRequestLoading(false);
                  }
                }}
              >
                <textarea
                  className="w-full min-h-[60px] p-2 border rounded-lg focus:outline-blue-400 resize-none mb-2 text-gray-700"
                  placeholder="Type your reason for retaking the quiz..."
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  disabled={requestLoading}
                  maxLength={300}
                />
                <button
                  className="w-full py-2 mt-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition disabled:bg-blue-300"
                  type="submit"
                  disabled={requestLoading}
                >
                  {requestLoading ? "Sending..." : "Request Retake"}
                </button>
                {requestError && (
                  <div className="mt-2 text-sm text-red-600">{requestError}</div>
                )}
                {requestSuccess && (
                  <div className="mt-2 text-sm text-green-700">{requestSuccess}</div>
                )}
              </form>
            </div>
          </div>
        )}
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
