import React, { useEffect, useState } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "Pending",
  });

  // 🔍 Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const url =
        role === "admin"
          ? "http://localhost:5000/api/tasks"
          : "http://localhost:5000/api/tasks/my-tasks";

      const { data } = await axios.get(url, { headers });
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const url =
        role === "admin"
          ? "http://localhost:5000/api/projects/all"
          : "http://localhost:5000/api/projects";

      const res = await axios.get(url, { headers });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers,
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (role === "admin") {
      fetchProjects();
      fetchUsers();
    }

    const refresh = () => fetchTasks();
    window.addEventListener("dataUpdated", refresh);

    return () => window.removeEventListener("dataUpdated", refresh);
  }, []);

  // Save or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingTaskId}`,
          form,
          { headers }
        );
      } else {
        await axios.post("http://localhost:5000/api/tasks", form, {
          headers,
        });
      }

      setForm({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        status: "Pending",
      });
      setEditingTaskId(null);

      fetchTasks();
      window.dispatchEvent(new Event("dataUpdated"));
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers,
        });
        fetchTasks();
        window.dispatchEvent(new Event("dataUpdated"));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  // Edit
  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      project: task.project?._id || "",
      assignedTo: task.assignedTo?._id || "",
      status: task.status,
    });
    setEditingTaskId(task._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setForm({
      title: "",
      description: "",
      project: "",
      assignedTo: "",
      status: "Pending",
    });
  };

  // Member status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status: newStatus },
        { headers }
      );
      fetchTasks();
      window.dispatchEvent(new Event("dataUpdated"));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔍 FILTERED TASKS
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" || task.status === statusFilter;

    const matchesProject =
      projectFilter === "" || task.project?._id === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex-1">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        {role === "admin" ? "Manage Tasks" : "My Tasks"}
      </h2>

      {/* ADMIN ONLY FORM */}
      {role === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-5 text-gray-700">
            {editingTaskId ? "Edit Task" : "Create New Task"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 p-3 w-full rounded-lg"
              required
            />

            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>

            <select
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Assign User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border border-gray-300 p-3 w-full rounded-lg mt-4"
          />

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* 🔍 SEARCH + FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg flex-1 min-w-[250px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg"
        >
          <option value="">Filter Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {role === "admin" && (
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg"
          >
            <option value="">Filter Project</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TASK LIST */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {role === "admin" ? "All Tasks" : "My Assigned Tasks"}
        </h3>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 font-medium">S.No</th>
                  <th className="p-3 font-medium">Title</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Status</th>
                  {role === "admin" && (
                    <th className="p-3 font-medium">Assigned To</th>
                  )}
                  {role === "admin" && (
                    <th className="p-3 font-medium text-center">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{task.title}</td>
                    <td className="p-3">{task.description}</td>

                    <td className="p-3">
                      {role === "member" ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                          className="border border-gray-300 rounded p-1"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      ) : (
                        task.status
                      )}
                    </td>

                    {role === "admin" && (
                      <td className="p-3">
                        {task.assignedTo?.name || "Unassigned"}
                      </td>
                    )}

                    {role === "admin" && (
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(task._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
