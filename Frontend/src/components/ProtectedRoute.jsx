import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function RoleRoute({ requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== requiredRole) {
    // If they are logged in but don't have the right role, 
    // redirect them to their respective dashboard
    const redirectPath = user.role === "admin" ? "/admin" : "/employee";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
