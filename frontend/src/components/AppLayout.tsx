import React from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAppContext } from "@/src/store/AppStore";
import { Button } from "@/src/components/ui/Button";
import { LogOut, LayoutDashboard, Briefcase, Bookmark, PlusCircle, Users } from "lucide-react";

export function AppLayout() {
  const { user, logout, isAuthLoading } = useAppContext();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getNavItems = () => {
    switch (user.role) {
      case "Student":
        return [
          { name: "Dashboard", path: "/student", icon: LayoutDashboard },
          { name: "Watchlist", path: "/student/watchlist", icon: Bookmark },
        ];
      case "Faculty":
        return [
          { name: "My Posted Jobs", path: "/faculty", icon: Briefcase },
          { name: "Post Opportunity", path: "/faculty/post", icon: PlusCircle },
        ];
      case "Admin":
        return [
          { name: "Overview", path: "/admin", icon: LayoutDashboard },
          { name: "All Opportunities", path: "/admin/jobs", icon: Briefcase },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-6">
            <Link to={`/${user.role?.toLowerCase()}`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">AcadLink AI</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 text-right hidden sm:block">
              <p className="font-medium text-gray-900 leading-none">{user.name}</p>
              <p className="text-xs text-gray-500 mt-1">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden border-t border-gray-100 flex overflow-x-auto">
           {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
