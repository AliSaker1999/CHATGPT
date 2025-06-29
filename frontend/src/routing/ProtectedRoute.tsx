import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
  role: "Admin" | "User";
  mustBeTaken?: boolean;    // Only allow if user.isTaken === true
  mustNotBeTaken?: boolean; // Only allow if user.isTaken === false
}

const ProtectedRoute = ({ children, role, mustBeTaken, mustNotBeTaken }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) return <Navigate to="/login" />;

  if (mustBeTaken && !user.isTaken) return <Navigate to="/user" />;
  if (mustNotBeTaken && user.isTaken) return <Navigate to="/user/best-result" />;

  return children;
};

export default ProtectedRoute;
