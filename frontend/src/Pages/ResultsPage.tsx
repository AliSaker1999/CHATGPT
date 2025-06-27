import { useEffect, useState } from "react";
import { QuizResultDto } from "../Models/QuizResult";
import {
  deleteResultById,
  getAllResults,
  getResultsByUsername,
} from "../Services/ResultService";

const ResultsPage = () => {
  const [results, setResults] = useState<QuizResultDto[]>([]);
  const [username, setUsername] = useState("");

  const fetchAll = async () => {
    const data = await getAllResults();
    setResults(data);
  };

  const handleSearch = async () => {
    if (!username.trim()) return fetchAll();
    const data = await getResultsByUsername(username.trim());
    setResults(data);
  };

  const handleDelete = async (id: number) => {
    await deleteResultById(id);
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Manage Quiz Results</h2>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded shadow">
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
          onClick={fetchAll}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="grid gap-4">
          {results.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="text-gray-700">
                  <strong>Username:</strong> {r.username}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {r.email}
                </p>
                <p className="text-gray-700">
                  <strong>Score:</strong> {r.score}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Submitted:</strong>{" "}
                  {new Date(r.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
