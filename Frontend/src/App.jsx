import { Routes, Route, Navigate } from "react-router-dom";
import { SignupForm } from "./components/signup-form";
import { LoginForm } from "./components/login-form";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-slate-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthLayout><SignupForm /></AuthLayout>} />
      <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute />}>
        {/* Layout Wrapper */}
        <Route element={<DashboardLayout />}>
          
          {/* Default dashboard redirect based on role is handled in RoleRoute, but we can just use specific paths */}
          <Route path="/dashboard" element={<RoleRoute requiredRole="employee" />} />

          {/* Employee Routes */}
          <Route element={<RoleRoute requiredRole="user" />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
