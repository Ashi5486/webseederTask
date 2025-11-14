import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch all users (Admin only)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Create new user
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password)
      return alert("All fields are required!");
    try {
      await axios.post("http://localhost:5000/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ name: "", email: "", password: "", role: "member" });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

      {/* Create User Form */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border rounded p-2 w-full md:w-1/4"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border rounded p-2 w-full md:w-1/4"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border rounded p-2 w-full md:w-1/4"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border rounded p-2 w-full md:w-1/6"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* User List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm mt-1">
              Role:{" "}
              <span
                className={`font-semibold ${
                  user.role === "admin" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {user.role}
              </span>
            </p>
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <p className="text-gray-500 italic text-center">No users found.</p>
      )}
    </div>
  );
};

export default Users;
