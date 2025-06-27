import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link
            to="/admin/questions"
            className="block px-3 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
          >
            Manage Questions
          </Link>
          <Link
            to="/admin/results"
            className="block px-3 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
          >
            Manage Results
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
