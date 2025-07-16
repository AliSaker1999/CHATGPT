import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/admin/questions", label: "Manage Questions", icon: (
    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 12h6M9 16h6M7 8h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ) },
  { to: "/admin/results", label: "Manage Results", icon: (
    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 17a4 4 0 004 4h10a4 4 0 004-4M12 12v9M12 3v9m0 0l3-3m-3 3l-3-3" />
    </svg>
  ) },
  { to: "/admin/retake-requests", label: "Retake Requests", icon: (
  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z" />
    <path d="M12 11v6M9 14h6" />
  </svg>
) },

  { to: "/admin/users", label: "Manage Users", icon: (
    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17 20h5V10l-2.5-2.5M17 20V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16h14z" />
      <circle cx="9" cy="10" r="4" />
    </svg>
  ) },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 shadow-2xl rounded-tr-3xl rounded-br-3xl flex flex-col py-7 px-5">
      {/* Logo and Title */}
      <div className="flex items-center mb-10">
        
        <Link to="/admin" className="flex items-center mb-10 group hover:opacity-90 transition">
        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full shadow">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 17v.01" />
            <path d="M12 13c0-2 3-2.5 3-5a3 3 0 10-6 0" />
          </svg>
        </div>
        <span className="ml-3 text-2xl text-white font-bold tracking-wide group-hover:underline">Admin</span>
      </Link>
      </div>
      {/* Menu */}
      <h2 className="text-lg text-white/80 font-semibold mb-6 pl-1">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition 
                ${active 
                  ? "bg-white/90 text-blue-800 shadow font-extrabold border-l-4 border-blue-500" 
                  : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              style={{marginRight: active ? "-10px" : undefined}}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
