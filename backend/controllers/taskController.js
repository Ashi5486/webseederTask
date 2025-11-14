import Task from "../models/Task.js";

// Admin: view all
export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
};

// Member: only their tasks
export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.json(tasks);
};

// Admin CRUD
export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};
export const updateTask = async (req, res) => {
  const { role, _id } = req.user;
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  // 🔒 Only admins or the assigned member can update
  if (role !== "admin" && task.assignedTo.toString() !== _id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Members can only change 'status'
  if (role === "member" && Object.keys(req.body).some(k => k !== "status")) {
    return res.status(400).json({ message: "Members can only update status" });
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
// ✅ Get tasks assigned to a specific member
export const getTasksForMember = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "title")
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching member tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};
