import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/admin/questions", label: "Manage Questions" },
  { to: "/admin/results", label: "Manage Results" },
  { to: "/admin/users", label: "Manage Users" }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-3 py-2 rounded font-medium transition ${
              location.pathname.startsWith(link.to)
                ? "bg-blue-100 text-gray-700 font-bold"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
