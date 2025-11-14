import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderKanban, ListChecks } from "lucide-react";
const MemberDashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/projects/my-projects", { headers }),
        axios.get("http://localhost:5000/api/tasks/my-tasks", { headers }),
      ]);

      setProjectsCount(projectsRes.data.length);
      setTasksCount(tasksRes.data.length);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  return (
    <div className="p-6 flex-1 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">Assigned Projects</h2>
            <p className="text-3xl font-bold text-blue-600">{projectsCount}</p>
          </div>
          <FolderKanban size={40} className="text-blue-600" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">My Tasks</h2>
            <p className="text-3xl font-bold text-green-600">{tasksCount}</p>
          </div>
          <ListChecks size={40} className="text-green-600" />
        </div>
      </div>

    </div>
  );
};

export default MemberDashboard;
