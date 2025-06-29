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
      if (results ) {
        
        setResult(results[0]);
      } else {
        setResult(null);
      }
      setLoading(false);
    };

    fetchResult();
  }, [user]);

  if (!user) return <div className="p-8">Unauthorized</div>;
  if (loading) return <div className="p-8">Loading your result...</div>;

  if (!result) return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-red-700 mb-2">No quiz result found.</h2>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">You Already Took The Quiz</h2>
      <div className="space-y-3">
        <div><strong>Username:</strong> {result.username}</div>
        <div><strong>Email:</strong> {result.email}</div>
        <div><strong>Score:</strong> {result.score}</div>
        <div><strong>Date:</strong> {new Date(result.submittedAt).toLocaleString()}</div>
      </div>
    </div>
  );
};

export default UserBestResultPage;
