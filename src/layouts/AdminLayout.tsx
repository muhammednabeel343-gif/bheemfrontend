import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "CPUs", path: "/admin/cpus" },
  { name: "GPUs", path: "/admin/gpus" },
  { name: "RAMs", path: "/admin/rams" },
  { name: "Games", path: "/admin/games" },
];

function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col bg-white shadow-md lg:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900">Project Bheem</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={signOut}
            className="w-full rounded-2xl bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
          <button
            onClick={signOut}
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 lg:hidden"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;