import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

// ================= AUTH =================
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ================= STUDENT =================
import Dashboard from "./pages/Student/Dashboard";
import SubmitComplaint from "./pages/Student/SubmitComplaint";
import Complaints from "./pages/Student/Complaints";
import ComplaintDetails from "./pages/Student/ComplaintDetails";
import EditComplaint from "./pages/Student/EditComplaint";
import Profile from "./pages/Student/Profile";
import Settings from "./pages/Student/Settings";

// ================= ADMIN =================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminComplaints from "./pages/Admin/AdminComplaints";
import AdminUsers from "./pages/Admin/AdminUsers";

// ================= MAINTENANCE =================
import MaintenanceDashboard from "./pages/Maintenance/MaintenanceDashboard";
import MaintenanceComplaints from "./pages/Maintenance/MaintenanceComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/edit/:id"
          element={
            <ProtectedRoute>
              <EditComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
                {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* ================= MAINTENANCE ROUTES ================= */}

        <Route
          path="/maintenance/dashboard"
          element={
            <ProtectedRoute maintenanceOnly={true}>
              <MaintenanceDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance/complaints"
          element={
            <ProtectedRoute maintenanceOnly={true}>
              <MaintenanceComplaints />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;