import { useEffect, useState } from "react";

const AdminWelcomeCard = () => {
  // Dummy data – replace with real values via API if available
  const [stats, setStats] = useState({
    users: 153,
    questions: 42,
    results: 312,
    avgScore: 76,
  });
  const [apiHealthy, setApiHealthy] = useState(true);
  const [lastLogin, setLastLogin] = useState<string>("");

  // Example: simulate last login (in a real app, get from API or storage)
  useEffect(() => {
    const login = localStorage.getItem("adminLastLogin");
    if (login) setLastLogin(login);
    else {
      const now = new Date().toLocaleString();
      setLastLogin(now);
      localStorage.setItem("adminLastLogin", now);
    }
    // Simulate API health ping (replace with actual API call if you want)
    setTimeout(() => setApiHealthy(true), 500);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[40vh] py-8">
      <img
        src="https://cdn.jsdelivr.net/gh/steven2358/illustrations/undraw_admin_re_4b8b.svg"
        alt="Admin"
        className="w-44 mb-6"
        loading="lazy"
      />
      <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Welcome, Admin!</h2>
      <p className="text-lg text-gray-700 mb-7 text-center max-w-lg">
        Use the panel on the left to manage all aspects of Quizify.
      </p>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6 justify-center mb-8 w-full max-w-3xl">
        <div className="flex-1 min-w-[140px] bg-blue-50 border-l-4 border-blue-400 rounded-xl p-4 shadow">
          <div className="text-blue-700 text-2xl font-extrabold">{stats.users}</div>
          <div className="text-gray-500 text-sm font-medium">Total Users</div>
        </div>
        <div className="flex-1 min-w-[140px] bg-green-50 border-l-4 border-green-400 rounded-xl p-4 shadow">
          <div className="text-green-700 text-2xl font-extrabold">{stats.questions}</div>
          <div className="text-gray-500 text-sm font-medium">Quiz Questions</div>
        </div>
        <div className="flex-1 min-w-[140px] bg-purple-50 border-l-4 border-purple-400 rounded-xl p-4 shadow">
          <div className="text-purple-700 text-2xl font-extrabold">{stats.results}</div>
          <div className="text-gray-500 text-sm font-medium">Quiz Results</div>
        </div>
        <div className="flex-1 min-w-[140px] bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow">
          <div className="text-yellow-600 text-2xl font-extrabold">{stats.avgScore}%</div>
          <div className="text-gray-500 text-sm font-medium">Average Score</div>
        </div>
      </div>

      {/* System and last login */}
      <div className="flex gap-6 flex-wrap justify-center mt-4 w-full max-w-xl">
        <div className="bg-white/80 border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-3 shadow">
          <span
            className={`w-3 h-3 rounded-full inline-block ${apiHealthy ? "bg-green-500" : "bg-red-500"} mr-2`}
            title={apiHealthy ? "System Online" : "Offline"}
          />
          <span className="text-gray-700 font-medium">
            System Status:{" "}
            <span className={apiHealthy ? "text-green-700" : "text-red-700"}>
              {apiHealthy ? "Online" : "Offline"}
            </span>
          </span>
        </div>
        <div className="bg-white/80 border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-3 shadow">
          <svg className="w-6 h-6 text-blue-500 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-gray-700 font-medium">
            Last Admin Login:{" "}
            <span className="text-blue-700">{lastLogin}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcomeCard;
