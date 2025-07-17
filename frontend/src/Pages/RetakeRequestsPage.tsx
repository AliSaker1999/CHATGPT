import { useEffect, useState } from "react";
import {
  getAllRetakeRequests,
  approveRetakeRequest,
  denyRetakeRequest,
  QuizRetakeRequestDto,
} from "../Services/quizRetakeRequestService";
import { useAuth } from "../Context/AuthContext";

const RetakeRequestsPage = () => {
  const { user } = useAuth();

  // ✅ Always define hooks at the top level!
  const [requests, setRequests] = useState<QuizRetakeRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllRetakeRequests(user!.token);
      setRequests(data);
    } catch (e: any) {
      setError("Failed to fetch requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchRequests();
    // eslint-disable-next-line
  }, [user]);

  if (!user) return <div className="p-8 text-red-600 font-bold">Unauthorized</div>;

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setError("");
    try {
      await approveRetakeRequest(id, user.token);
      fetchRequests();
    } catch {
      setError("Failed to approve request.");
    }
    setActionLoading(null);
  };

  const handleDeny = async (id: number) => {
    setActionLoading(id);
    setError("");
    try {
      await denyRetakeRequest(id, user.token);
      fetchRequests();
    } catch {
      setError("Failed to deny request.");
    }
    setActionLoading(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6">Quiz Retake Requests</h1>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {loading ? (
        <div className="text-blue-600 text-lg">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-600 text-lg">No retake requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border bg-white rounded-xl shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Requested At</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-3 py-2 font-bold text-blue-700">{req.userName}</td>
                  <td className="px-3 py-2">{req.email}</td>
                  <td className="px-3 py-2">{req.message}</td>
                  <td className="px-3 py-2">{new Date(req.requestedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    {req.isApproved === null && (
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    )}
                    {req.isApproved === true && (
                      <span className="text-green-600 font-semibold">Approved</span>
                    )}
                    {req.isApproved === false && (
                      <span className="text-red-600 font-semibold">Denied</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {req.isApproved === null && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-bold transition disabled:opacity-60"
                        >
                          {actionLoading === req.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDeny(req.id)}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-60"
                        >
                          {actionLoading === req.id ? "Denying..." : "Deny"}
                        </button>
                      </div>
                    )}
                    {(req.isApproved === true || req.isApproved === false) && (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetakeRequestsPage;
