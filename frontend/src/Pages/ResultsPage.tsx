import { useEffect, useState } from "react";
import { QuizResultDto } from "../Models/QuizResult";
import { deleteResultById, getAllResults, getResultsByUsername } from "../Services/ResultService";
import Sidebar from "../Components/Sidebar";

const ResultsPage = () => {
  const [results, setResults] = useState<QuizResultDto[]>([]);
  const [username, setUsername] = useState("");

  const fetchAllResults = async () => {
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  };

  const handleSearch = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return fetchAllResults();
    }
    try {
      const data = await getResultsByUsername(trimmedUsername);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResultById(id);
      fetchAllResults();
    } catch (error) {
      console.error("Failed to delete result:", error);
    }
  };

  useEffect(() => {
    fetchAllResults();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">Manage Quiz Results</h2>
          {/* Search Section */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded shadow">
            <input
              type="text"
              placeholder="Search by username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              onClick={fetchAllResults}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
          {/* Results List */}
          {results.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : (
            <div className="grid gap-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white border rounded p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      <strong>Username:</strong> {result.username}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {result.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Score:</strong> {result.score}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Submitted:</strong>{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
