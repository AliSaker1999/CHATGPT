import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserDto } from "../Models/UserDto";
import { getAllUsers, deleteUserByUsername } from "../Services/UserService";
import ConfirmModal from "../Components/ConfirmModal"; // Import the modal

const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = search
    ? users.filter((u) =>
        u.userName.toLowerCase().includes(search.toLowerCase())
      )
    : users;

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
          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium font-bold bg-blue-100"
          >
            Manage Users
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>

          <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded shadow">
            <input
              type="text"
              placeholder="Search by username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={fetchUsers}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.userName}
                  className="bg-white border rounded p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      <strong>Username:</strong> {user.userName}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Role:</strong> {user.role}
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(user.userName)}
                    className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Confirm Modal */}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete ${selectedUser}?`}
      />
    </div>
  );
};

export default ManageUsersPage;
