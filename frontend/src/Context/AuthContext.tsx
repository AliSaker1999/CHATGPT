import { createContext, useContext, useState, ReactNode } from "react";
import { UserProfileToken } from "../Models/User";

interface AuthContextType {
  user: UserProfileToken | null;
  login: (userData: UserProfileToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfileToken | null>(null);

  const login = (userData: UserProfileToken) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
  };

  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
