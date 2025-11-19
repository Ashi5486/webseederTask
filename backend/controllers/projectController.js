// import Project from "../models/Project.js";
// import User from "../models/User.js";

// // ✅ Get all projects (Admin only)
// export const getProjects = async (req, res) => {
//   const projects = await Project.find()
//     .populate("members", "name email")
//     .populate("createdBy", "name email");
//   res.json(projects);
// };

// // ✅ Create new project
// export const createProject = async (req, res) => {
//   const { title, description, members } = req.body;

//   const newProject = new Project({
//     title,
//     description,
//     members,
//     createdBy: req.user._id,
//   });

//   const savedProject = await newProject.save();
//   res.status(201).json(savedProject);
// };

// // ✅ Update a project
// export const updateProject = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, members } = req.body;

//   const project = await Project.findById(id);
//   if (!project) return res.status(404).json({ message: "Project not found" });

//   project.title = title || project.title;
//   project.description = description || project.description;
//   project.members = members || project.members;

//   const updated = await project.save();
//   res.json(updated);
// };

// // ✅ Delete a project
// export const deleteProject = async (req, res) => {
//   const { id } = req.params;
//   const project = await Project.findById(id);
//   if (!project) return res.status(404).json({ message: "Project not found" });

//   await project.deleteOne();
//   res.json({ message: "Project deleted successfully" });
// };

// // ✅ Get projects for logged-in member
// export const getProjectsForMember = async (req, res) => {
//   try {
//     const projects = await Project.find({ members: req.user._id })
//       .populate("members", "name email")
//       .populate("createdBy", "name email");

//     res.json(projects);
//   } catch (error) {
//     console.error("Error fetching member projects:", error);
//     res.status(500).json({ message: "Server error while fetching projects" });
//   }
// };


import Project from "../models/Project.js";
import User from "../models/User.js";

// ✅ Get all projects (Admin only)
export const getProjects = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can view all projects" });

  const projects = await Project.find()
    .populate("members", "name email")
    .populate("createdBy", "name email");

  res.json(projects);
};

// ✅ Create new project (Admin only)
export const createProject = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can create projects" });

  const { title, description, members } = req.body;

  if (!title)
    return res.status(400).json({ message: "Title is required" });

  const newProject = new Project({
    title,
    description,
    members: members || [],
    createdBy: req.user._id,
  });

  const savedProject = await newProject.save();
  res.status(201).json(savedProject);
};

// ✅ Update project (Admin only)
export const updateProject = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can update projects" });

  const { id } = req.params;
  const { title, description, members } = req.body;

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (title) project.title = title;
  if (description) project.description = description;
  if (members) project.members = members;

  const updated = await project.save();
  res.json(updated);
};

// ✅ Delete project (Admin only)
export const deleteProject = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can delete projects" });

  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  await project.deleteOne();
  res.json({ message: "Project deleted successfully" });
};

// ✅ Get projects for logged-in member
export const getProjectsForMember = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    console.error("Error fetching member projects:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

// ✅ Assign members to a project (Admin only)
export const assignMembers = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can assign members" });

  const { id } = req.params;
  const { members } = req.body;

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  project.members = members; // overwrite with new selected list
  await project.save();

  const populated = await Project.findById(id)
    .populate("members", "name email")
    .populate("createdBy", "name email");

  res.json(populated);
};
