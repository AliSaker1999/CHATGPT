import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const QuizRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.isTaken) {
      navigate("/user/best-result", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">Redirecting...</div>
    </div>
  );
};

export default QuizRedirect;
