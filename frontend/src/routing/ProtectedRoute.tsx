import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
  role: "Admin" | "User"; // only allowed roles
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    // Logged in but wrong role
    return <Navigate to="/login" />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
