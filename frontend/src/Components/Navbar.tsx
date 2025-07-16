import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    login(null);
    navigate("/login");
  };

  const showLogin =
    !user && (location.pathname === "/" || location.pathname === "/home");

  return (
    <nav className="backdrop-blur-md bg-white/70 border-b border-blue-100 px-6 py-3 shadow-lg flex justify-between items-center rounded-b-2xl sticky top-0 z-30">
      {/* Logo & App Name */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center group">
          {/* Quizify Logo Icon (SVG) */}
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-700 transition">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-white"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 17v.01" />
              <path d="M12 13c0-2 3-2.5 3-5a3 3 0 10-6 0" />
            </svg>
          </span>
          <span className="ml-2 font-bold text-2xl text-blue-700 tracking-widest group-hover:text-blue-900 transition">
            Quizify
          </span>
        </Link>
      </div>

      <div className="space-x-4 flex items-center">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all font-semibold text-base"
          >
            Logout
          </button>
        ) : showLogin ? (
          <Link
            to="/login"
            className="bg-white text-blue-700 border border-blue-600 px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all font-semibold text-base"
          >
            Login
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
