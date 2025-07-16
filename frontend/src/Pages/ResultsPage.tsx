import { useEffect, useState } from "react";
import { QuizResultDto } from "../Models/QuizResult";
import { deleteResultById, getAllResults, getResultsByUsername } from "../Services/ResultService";
import Sidebar from "../Components/Sidebar";

const ResultsPage = () => {
  const [results, setResults] = useState<QuizResultDto[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    const trimmedUsername = username.trim();
    setLoading(true);
    if (!trimmedUsername) {
      await fetchAllResults();
      setLoading(false);
      return;
    }
    try {
      const data = await getResultsByUsername(trimmedUsername);
      setResults(data);
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteResultById(id);
      fetchAllResults();
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchAllResults();
  }, []);

  const getScoreColor = (score: number) =>
    score >= 8 ? "text-green-600"
      : score >= 5 ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
    
      <main className="flex-1 p-8">
        <div className="space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Manage Quiz Results
          </h2>
          {/* Search Section */}
          <div className="flex flex-wrap items-center gap-3 bg-white/90 p-4 rounded-xl shadow border border-blue-100">
            <div className="flex flex-1 items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              Search
            </button>
            <button
              onClick={fetchAllResults}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="text-blue-600 font-semibold text-lg text-center py-10">Loading...</div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white/70 p-12 rounded-xl shadow text-gray-400 mt-10">
              <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 9.01h.01M15 9.01h.01M9 15c1.5 1 3 1 4.5 0" />
              </svg>
              <span className="text-xl">No results found.</span>
            </div>
          ) : (
            <div className="grid gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white/90 border border-blue-100 rounded-xl p-5 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-lg transition"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <span>
                        <span className="font-bold text-gray-700">Username:</span>{" "}
                        <span className="text-blue-700 font-bold">{result.username}</span>
                      </span>
                      <span>
                        <span className="font-bold text-gray-700">Email:</span>{" "}
                        <span className="text-gray-500">{result.email}</span>
                      </span>
                      <span>
                        <span className="font-bold text-gray-700">Score:</span>{" "}
                        <span className={`font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                      </span>
                    </div>
                    <span className="block text-gray-500 text-xs mt-1">
                      <span className="font-semibold">Submitted:</span>{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="mt-4 sm:mt-0 sm:ml-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
