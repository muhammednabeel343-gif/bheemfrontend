import { useEffect, useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import {
  Gamepad2,
  Cpu,
  Gpu,
  HardDrive,
  Monitor,
  TrendingUp,
  Activity,
} from "lucide-react";

interface DashboardStats {
  total_games: number;
  total_cpus: number;
  total_gpus: number;
  total_rams: number;
  total_oses: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon_type: string;
}

function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "day" | "week" | "month" | "year" | "custom" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    setError("");
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiUrl) {
      setError("API_URL not configured");
      setLoading(false);
      return;
    }
    
    // Fetch stats
    fetch(`${apiUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((t) => {
            throw new Error(t || `Dashboard load failed (${res.status})`);
          });
        }
        return res.json();
      })
      .then(setStats)
      .catch((err) => {
        console.error("Dashboard stats error:", err);
        setError(err?.message || "Failed to fetch dashboard stats");
      })
      .finally(() => setLoading(false));
    
    // Fetch activity
    fetch(`${apiUrl}/admin/dashboard/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return { activity: [] };
        return res.json();
      })
      .then((data) => setActivity(data.activity || []))
      .catch((err) => {
        console.error("Dashboard activity error:", err);
        setActivity([]);
      });
  }, [token]);

  if (!token)
    return (
      <div className="text-slate-400">Not authenticated as admin.</div>
    );

  // Get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case "game":
        return Gamepad2;
      case "cpu":
        return Cpu;
      case "gpu":
        return Gpu;
      case "ram":
        return HardDrive;
      case "os":
        return Monitor;
      default:
        return Activity;
    }
  };

  // Get color based on type
  const getColor = (type: string) => {
    switch (type) {
      case "game":
        return "text-blue-400";
      case "cpu":
        return "text-emerald-400";
      case "gpu":
        return "text-purple-400";
      case "ram":
        return "text-amber-400";
      case "os":
        return "text-orange-400";
      default:
        return "text-slate-400";
    }
  };

  const cards = [
    {
      label: "Total Games",
      value: stats?.total_games ?? 0,
      icon: Gamepad2,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      label: "Total CPUs",
      value: stats?.total_cpus ?? 0,
      icon: Cpu,
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total GPUs",
      value: stats?.total_gpus ?? 0,
      icon: Gpu,
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      label: "Total RAMs",
      value: stats?.total_rams ?? 0,
      icon: HardDrive,
      color: "from-amber-500/20 to-amber-600/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
    },
    {
      label: "Total OS",
      value: stats?.total_oses ?? 0,
      icon: Monitor,
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
    },
  ];

  // Filter activities based on selected period
  const getFilteredActivities = () => {
    // If no filter selected, return empty array
    if (!filterPeriod) return [];

    const now = new Date();
    return activity.filter((item) => {
      const itemDate = new Date(item.timestamp);
      const diffTime = now.getTime() - itemDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (filterPeriod) {
        case "day":
          return diffDays <= 1;
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        case "year":
          return diffDays <= 365;
        case "custom":
          if (!selectedDate) return false;
          const selected = new Date(selectedDate);
          const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          const selectedDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
          return itemDay.getTime() === selectedDay.getTime();
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredActivities = getFilteredActivities();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome to your GameReady admin panel
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105`}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg bg-black/30 p-3 ${card.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {loading ? "..." : card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed and Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-purple-500/20 bg-[#0F172A]/50 backdrop-blur-sm overflow-hidden">
            <div className="border-b border-purple-500/20 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Recent Activity
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  ({filteredActivities.length} activities)
                </span>
              </div>

              {/* Filter Buttons and Date Picker */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "all" as const },
                    { label: "Last Day", value: "day" as const },
                    { label: "Last Week", value: "week" as const },
                    { label: "Last Month", value: "month" as const },
                    { label: "Last Year", value: "year" as const },
                    { label: "Custom Date", value: "custom" as const },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setFilterPeriod(filter.value);
                        if (filter.value !== "custom") {
                          setSelectedDate("");
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        filterPeriod === filter.value
                          ? "bg-purple-500/40 text-purple-200 border border-purple-400/50"
                          : "bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Date Picker for Custom Date */}
                {filterPeriod === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-purple-500/20 border border-purple-400/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="text-xs text-slate-400">
                      {selectedDate && `Showing activities from ${new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="divide-y divide-purple-500/10 max-h-72 overflow-y-scroll scrollbar-thin">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => {
                  const Icon = getIcon(item.type);
                  const color = getColor(item.type);
                  const fullDate = new Date(item.timestamp);
                  const formattedDate = fullDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-purple-500/5"
                    >
                      <div className={`rounded-lg p-2 bg-black/30 ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    {!filterPeriod
                      ? "Select a filter to view activities"
                      : filterPeriod === "custom" && !selectedDate
                      ? "Select a date to view activities"
                      : "No activities found in this period"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;