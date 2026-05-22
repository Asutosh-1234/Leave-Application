import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-slate-800">
                LeaveManager
              </span>
              <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 hidden sm:block">
                Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
