import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import GameReadyLogo from "../components/GameReadyLogo";
import {
  LayoutDashboard,
  Cpu,
  Gpu,
  HardDrive,
  Monitor,
  Gamepad2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "CPU", path: "/admin/cpus", icon: Cpu },
  { name: "GPU", path: "/admin/gpus", icon: Gpu },
  { name: "RAM", path: "/admin/rams", icon: HardDrive },
  { name: "OS", path: "/admin/oses", icon: Monitor },
  { name: "Games", path: "/admin/games", icon: Gamepad2 },
];

function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-[#0F172A] transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-purple-500/20 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 flex-col items-start justify-center border-b border-purple-500/20 px-6">
          <div className="scale-75 origin-top-left">
            <GameReadyLogo variant="compact" />
          </div>
          <p className="text-xs text-slate-400">Measure Your PC. Match Your Games.</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-500 shadow-lg shadow-purple-500/10"
                    : "text-slate-400 hover:text-white hover:bg-purple-500/10 border-l-2 border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-purple-500/20 p-4">
          <button
            onClick={() => {
              signOut();
              setMobileOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg bg-purple-500/10 px-4 py-3 text-purple-300 transition-all duration-200 hover:bg-purple-500/20 hover:text-purple-200 border border-purple-500/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-4 border-b border-purple-500/20 bg-[#0F172A]/50 backdrop-blur-sm px-6 py-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 hover:bg-purple-500/10 text-slate-400 hover:text-purple-300"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pl-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;