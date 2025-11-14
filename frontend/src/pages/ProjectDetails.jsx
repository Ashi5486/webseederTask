import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [taskForm, setTaskForm] = useState({
    title: "",
    assignedTo: "",
    status: "pending",
    project: id,
  });

  useEffect(() => {
    fetchProject();
    fetchTasks();
    if (role === "admin") fetchUsers();
  }, []);

  const fetchProject = async () => {
    const res = await axios.get(`http://localhost:5000/api/projects/${id}`, { headers });
    setProject(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/tasks/project/${id}`, { headers });
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users", { headers });
    setUsers(res.data);
  };

  const createTask = async (e) => {
    e.preventDefault();
    const res = await axios.post(`http://localhost:5000/api/tasks`, taskForm, { headers });
    console.log(res)
    setTaskForm({ title: "", assignedTo: "", status: "pending", project: id });
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      { status },
      { headers }
    );
    fetchTasks();
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <h2 className="text-xl font-semibold mb-3">Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="p-3 bg-gray-100 rounded-lg mb-2">
            <p className="font-semibold">{task.title}</p>
            <p className="text-sm">Assigned to: {task.assignedTo?.name}</p>
            <p>Status: {task.status}</p>

            {/* Member can update only their own tasks */}
            {role === "member" && task.assignedTo?._id === localStorage.getItem("userId") && (
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="mt-1 p-1 border"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        ))
      )}

      {role === "admin" && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold mb-3">Create Task</h3>

          <form onSubmit={createTask}>
            <input
              type="text"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            />

            <select
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            >
              <option value="">Assign to</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Create Task
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
