import axios from "axios";

// Base URL of your backend API
const API_URL = "http://localhost:5000/api";

// ✅ Automatically attach token to every request
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// 🔹 AUTH API
// ==============================
export const login = (data) => axiosInstance.post("/auth/login", data);
export const register = (data) => axiosInstance.post("/auth/register", data);

// ==============================
// 🔹 PROJECTS API
// ==============================
export const fetchProjects = () => axiosInstance.get("/projects");
export const createProject = (data) => axiosInstance.post("/projects", data);
export const updateProject = (id, data) =>
  axiosInstance.put(`/projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);
export const assignMember = (id, memberId) =>
  axiosInstance.put(`/projects/${id}/assign`, { memberId });

// ==============================
// 🔹 TASKS API
// ==============================
export const fetchTasks = () => axiosInstance.get("/tasks");
export const createTask = (data) => axiosInstance.post("/tasks", data);
export const updateTask = (id, data) => axiosInstance.put(`/tasks/${id}`, data);
export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`);
export const assignTask = (id, assignedTo) =>
  axiosInstance.put(`/tasks/${id}/assign`, { assignedTo });
