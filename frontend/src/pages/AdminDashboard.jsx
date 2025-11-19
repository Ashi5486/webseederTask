import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/projects/all", { headers }), // FIXED
        axios.get("http://localhost:5000/api/tasks", { headers }),
        axios.get("http://localhost:5000/api/users", { headers }),
      ]);

      // Update statistics
      setStats({
        projects: projectsRes.data.length,
        tasks: tasksRes.data.length,
        users: usersRes.data.length,
      });

      // Sort latest 5 tasks
      const sortedTasks = tasksRes.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentTasks(sortedTasks);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on start
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600 text-lg font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin Dashboard 👨‍💻
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-gray-500 text-sm">Total Projects</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.projects}</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-4xl font-bold text-green-600">{stats.tasks}</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-gray-500 text-sm">Total Members</h3>
          <p className="text-4xl font-bold text-purple-600">{stats.users}</p>
        </div>
      </div>

      Recent Tasks
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>

        {recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="p-3">{task.title}</td>

                    <td className="p-3 text-gray-600 truncate max-w-xs">
                      {task.description}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
