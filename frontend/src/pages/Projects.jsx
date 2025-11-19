// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);
//   const [form, setForm] = useState({ title: "", description: "", members: [] });

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     fetchProjects();
//     if (role === "admin") fetchUsers();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);

//       const url =
//         role === "admin"
//           ? "http://localhost:5000/api/projects/all"
//           : "http://localhost:5000/api/projects";

//       const res = await axios.get(url, { headers });
//       setProjects(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load projects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users", { headers });
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load users");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (role !== "admin") return alert("Only admins can create or edit projects");

//     try {
//       if (editingProject) {
//         await axios.put(
//           `http://localhost:5000/api/projects/${editingProject._id}`,
//           form,
//           { headers }
//         );
//       } else {
//         await axios.post("http://localhost:5000/api/projects", form, { headers });
//       }

//       setForm({ title: "", description: "", members: [] });
//       setEditingProject(null);
//       fetchProjects();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save project");
//     }
//   };

//   const handleEdit = (project) => {
//     if (role !== "admin") return alert("Only admins can edit projects");

//     setEditingProject(project);
//     setForm({
//       title: project.title,
//       description: project.description,
//       members: project.members.map((m) => m._id || m),
//     });
//   };

//   const handleDelete = async (id) => {
//     if (role !== "admin") return alert("Only admins can delete projects");

//     if (window.confirm("Delete this project?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/projects/${id}`, { headers });
//         fetchProjects();
//       } catch (err) {
//         console.log(err);
//         alert("Failed to delete project");
//       }
//     }
//   };

//   const toggleMember = (userId) => {
//     setForm((prev) => {
//       const isSelected = prev.members.includes(userId);
//       return {
//         ...prev,
//         members: isSelected
//           ? prev.members.filter((id) => id !== userId)
//           : [...prev.members, userId],
//       };
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen flex-1">

//       {/* Header */}
//       <h1 className="text-3xl font-semibold text-gray-800 mb-6">
//         {role === "admin" ? "Manage Projects" : "My Projects"}
//       </h1>

//       {/* ADMIN FORM */}
//       {role === "admin" && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
//         >
//           <h2 className="text-xl font-bold mb-4 text-gray-800">
//             {editingProject ? "Edit Project" : "Create New Project"}
//           </h2>

//           {/* Title */}
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Project Title
//           </label>
//           <input
//             type="text"
//             placeholder="Enter project title"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
//             required
//           />

//           {/* Description */}
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             placeholder="Enter project description"
//             value={form.description}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 description: e.target.value,
//               })
//             }
//             className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
//           />

//           {/* Members */}
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Assign Members
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
//             {users.map((user) => (
//               <label
//                 key={user._id}
//                 className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
//               >
//                 <input
//                   type="checkbox"
//                   checked={form.members.includes(user._id)}
//                   onChange={() => toggleMember(user._id)}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {user.name} ({user.email})
//                 </span>
//               </label>
//             ))}
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 mt-3">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               {editingProject ? "Update Project" : "Create Project"}
//             </button>

//             {editingProject && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingProject(null);
//                   setForm({ title: "", description: "", members: [] });
//                 }}
//                 className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       )}

//       {/* PROJECT LIST */}
//       <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           {role === "admin" ? "Existing Projects" : "Assigned Projects"}
//         </h2>

//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : projects.length === 0 ? (
//           <p className="text-gray-500">No projects found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border rounded-lg overflow-hidden">
//               <thead className="bg-gray-200 text-gray-700">
//                 <tr>
//                   <th className="text-left p-3 font-medium">S.No</th>
//                   <th className="text-left p-3 font-medium">Project Name</th>
//                   <th className="text-left p-3 font-medium">Description</th>
//                   <th className="text-left p-3 font-medium text-center">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {projects.map((proj,index) => (
//                   <tr key={proj.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">{index+1}</td>
//                     <td className="p-3">{proj.title}</td>
//                     <td className="p-3">{proj.description}</td>
//                     <td className="p-3 text-center flex justify-center gap-2">
//                       {role === "admin" ? (
//                         <>
//                           <button
//                             onClick={() => handleEdit(proj)}
//                             className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(proj._id)}
//                             className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
//                           >
//                             Delete
//                           </button>
//                         </>
//                       ) : (
//                         <span className="text-gray-400">—</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;



import React, { useEffect, useState } from "react";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", members: [] });

  // NEW: search + filter states
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProjects();
    if (role === "admin") fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const url =
        role === "admin"
          ? "http://localhost:5000/api/projects/all"
          : "http://localhost:5000/api/projects";

      const res = await axios.get(url, { headers });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "admin") return alert("Only admins can create or edit projects");

    try {
      if (editingProject) {
        await axios.put(
          `http://localhost:5000/api/projects/${editingProject._id}`,
          form,
          { headers }
        );
      } else {
        await axios.post("http://localhost:5000/api/projects", form, { headers });
      }

      setForm({ title: "", description: "", members: [] });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleEdit = (project) => {
    if (role !== "admin") return alert("Only admins can edit projects");

    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      members: project.members.map((m) => m._id || m),
    });
  };

  const handleDelete = async (id) => {
    if (role !== "admin") return alert("Only admins can delete projects");

    if (window.confirm("Delete this project?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, { headers });
        fetchProjects();
      } catch (err) {
        console.log(err);
        alert("Failed to delete project");
      }
    }
  };

  const toggleMember = (userId) => {
    setForm((prev) => {
      const isSelected = prev.members.includes(userId);
      return {
        ...prev,
        members: isSelected
          ? prev.members.filter((id) => id !== userId)
          : [...prev.members, userId],
      };
    });
  };


  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.title.toLowerCase().includes(search.toLowerCase());

    const matchesMember =
      memberFilter === "" ||
      proj.members.some((m) => (m._id || m) === memberFilter);

    return matchesSearch && matchesMember;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex-1">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {role === "admin" ? "Manage Projects" : "My Projects"}
      </h1>

      {role === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>

          {/* Title */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            placeholder="Enter project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Description */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter project description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Members */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Assign Members
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {users.map((user) => (
              <label
                key={user._id}
                className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={form.members.includes(user._id)}
                  onChange={() => toggleMember(user._id)}
                />
                <span className="text-sm text-gray-700">
                  {user.name} ({user.email})
                </span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </button>

            {editingProject && (
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setForm({ title: "", description: "", members: [] });
                }}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      
      <div className="bg-white shadow-md p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center border">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

   
        {role === "admin" && (
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Filter by Member</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* PROJECT LIST */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {role === "admin" ? "Existing Projects" : "Assigned Projects"}
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-gray-500">No matching projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left p-3 font-medium">S.No</th>
                  <th className="text-left p-3 font-medium">Project Name</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((proj, index) => (
                  <tr key={proj._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{proj.title}</td>
                    <td className="p-3">{proj.description}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      {role === "admin" ? (
                        <>
                          <button
                            onClick={() => handleEdit(proj)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(proj._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
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

export default Projects;
