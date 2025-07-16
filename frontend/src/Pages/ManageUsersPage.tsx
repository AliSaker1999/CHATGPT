import { useEffect, useState } from "react";
import { UserDto } from "../Models/UserDto";
import { getAllUsers, deleteUserByUsername } from "../Services/UserService";
import ConfirmModal from "../Components/ConfirmModal";
import Sidebar from "../Components/Sidebar";

const roleColor = (role: string) =>
  role === "Admin" ? "bg-gradient-to-br from-blue-500 to-blue-400" : "bg-gradient-to-br from-green-400 to-green-300";

const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  };

  const openModal = (username: string) => {
    setSelectedUser(username);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserByUsername(selectedUser);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
    setSelectedUser(null);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const filteredUsers = search
    ? users.filter((u) =>
        u.userName.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
      <Sidebar />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-blue-700 flex items-center gap-2">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 14a4 4 0 1 1-8 0m8 0V7m0 7H8" />
            </svg>
            Manage Users
          </h2>

          {/* Search bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl shadow-md border border-blue-100">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="9" cy="9" r="7" />
                  <path d="M16 16l-3.5-3.5" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg font-bold hover:bg-blue-200 transition"
            >
              Refresh
            </button>
          </div>

          {/* Loading & Results */}
          {loading ? (
            <div className="flex items-center justify-center py-10 text-blue-400 text-xl font-bold animate-pulse">
              <svg className="w-8 h-8 mr-3 animate-spin" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v4" />
              </svg>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-gray-500 text-lg text-center">
              No users found.
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredUsers.map((user) => (
                <div
                  key={user.userName}
                  className={`flex items-center bg-white rounded-2xl shadow group border-l-8 ${user.role === "Admin" ? "border-blue-400" : "border-green-300"} hover:shadow-xl transition px-5 py-6`}
                >
                  {/* Role Accent Bar */}
                  <div className={`w-2 h-14 rounded-lg mr-4 ${roleColor(user.role)}`}></div>
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-blue-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg>
                      {user.userName}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold">Email:</span> {user.email}
                    </div>
                    <div className="text-gray-500">
                      <span className="font-semibold">Role:</span>{" "}
                      <span className={user.role === "Admin" ? "text-blue-500 font-bold" : "text-green-500 font-bold"}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() => openModal(user.userName)}
                    className="ml-6 group-hover:scale-110 transition-transform text-white bg-red-500 hover:bg-red-600 rounded-full p-2"
                    title="Delete User"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <ConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete "${selectedUser}"?`}
        />
      </main>
    </div>
  );
};

export default ManageUsersPage;
