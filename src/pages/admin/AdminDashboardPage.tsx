import { useEffect, useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface DashboardStats {
  total_games: number;
  total_cpus: number;
  total_gpus: number;
  total_rams: number;
}

function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log('[AdminDashboard] status', res.status);
        if (!res.ok) return res.text().then((t) => { throw new Error(t || 'Dashboard load failed'); });
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(String(err?.message || err)))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <div className="text-slate-600">Not authenticated as admin.</div>;
  if (loading) return <div className="text-slate-600">Loading stats...</div>;
  if (error) return <div className="rounded-3xl bg-rose-100 p-4 text-sm text-rose-800">{error}</div>;

  const cards = [
    { label: "Total Games", value: stats?.total_games ?? 0, color: "bg-blue-500" },
    { label: "Total CPUs", value: stats?.total_cpus ?? 0, color: "bg-emerald-500" },
    { label: "Total GPUs", value: stats?.total_gpus ?? 0, color: "bg-purple-500" },
    { label: "Total RAMs", value: stats?.total_rams ?? 0, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      {loading ? (
        <div className="text-slate-600">Loading stats...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className={`mb-4 h-12 w-12 rounded-2xl ${card.color}`} />
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;