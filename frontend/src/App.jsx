import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />

        {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin - Projects */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <Projects />
              </div>
            </ProtectedRoute>
          }
        />

        {/* ⭐ NEW — Project Details (Admin + Member) */}
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <ProjectDetails />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin - Tasks */}
        <Route
          path="/admin/tasks"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <Tasks />
              </div>
            </ProtectedRoute>
          }
        />

        {/* ========== MEMBER ROUTES ========== */}
        <Route
          path="/member/*"
          element={
            <ProtectedRoute requiredRole="member">
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <MemberDashboard />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Member - Tasks */}
        <Route
          path="/member/tasks"
          element={
            <ProtectedRoute requiredRole="member">
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <Tasks />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized fallback */}
        <Route
          path="/unauthorized"
          element={<h2 className="text-center mt-10">🚫 Access Denied</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
