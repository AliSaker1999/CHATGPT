import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and user info from storage/context (implement as needed)
    localStorage.removeItem("token");
    login(null); // Assuming your login(null) logs out the user in your context
    navigate("/login");
  };

  const showLogin =
    !user && (location.pathname === "/" || location.pathname === "/home");

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 shadow flex justify-between items-center">
      <div>
        <Link to="/" className="font-bold text-xl tracking-widest">
          Quiz App
        </Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
          >
            Logout
          </button>
        ) : showLogin ? (
          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
          >
            Login
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
