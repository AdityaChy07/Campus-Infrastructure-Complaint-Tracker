import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const { user, token } = useAuth();

  // If not logged in
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin-only and user is not admin
  if (
    adminOnly &&
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;