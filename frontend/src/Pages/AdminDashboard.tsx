import Sidebar from "../Components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import AdminWelcomeCard from "../Components/AdminWelcomeCard"; // import it

const AdminDashboard = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/admin";
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <div className="bg-white/80 rounded-2xl shadow-xl min-h-[80vh] p-10">
          {isRoot ? <AdminWelcomeCard /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
