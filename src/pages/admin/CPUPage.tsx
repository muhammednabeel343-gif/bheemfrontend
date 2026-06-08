import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Cpu, Plus, Edit2, Trash2, X, Search } from "lucide-react";

interface CPU {
  id: number;
  name: string;
}

function CPUPage() {
  const { token } = useAdminAuth();
  const [cpus, setCPUs] = useState<CPU[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CPU | null>(null);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCPUs = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/cpus`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCPUs)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchCPUs();
  }, [fetchCPUs]);

  const handleSave = useCallback(async () => {
    const url = editing ? `/admin/cpus/${editing.id}` : "/admin/cpus";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${url}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    if (res.ok) {
      setShowModal(false);
      setEditing(null);
      setName("");
      if (editing) {
        setCPUs((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, name } : c))
        );
      } else {
        const created = await res.json();
        setCPUs((prev) => [...prev, created]);
      }
    }
  }, [token, editing, name]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this CPU?")) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/cpus/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setCPUs((prev) => prev.filter((c) => c.id !== id));
    }
  }, [token]);

  const openAddModal = () => {
    setEditing(null);
    setName("");
    setShowModal(true);
  };

  const openEditModal = (cpu: CPU) => {
    setEditing(cpu);
    setName(cpu.name);
    setShowModal(true);
  };

  const filteredCPUs = cpus.filter((cpu) =>
    cpu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CPU</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage processor database
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-purple-500 hover:bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 shadow-lg shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Add CPU
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search CPUs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-purple-500/20 bg-[#0F172A] px-10 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-purple-500/20 bg-[#0F172A]/50 backdrop-blur-sm overflow-hidden">
        {loading && cpus.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading CPUs...</p>
          </div>
        ) : filteredCPUs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">
              {cpus.length === 0 ? "No CPUs added yet." : "No results found."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-purple-500/20 bg-purple-500/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                    CPU Name
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-purple-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredCPUs.map((cpu) => (
                  <tr
                    key={cpu.id}
                    className="transition-all duration-200 hover:bg-purple-500/5"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-500/20 p-2">
                          <Cpu className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="font-medium">{cpu.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cpu)}
                          className="rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-3 py-2 text-xs font-medium text-blue-300 transition-all duration-200 flex items-center gap-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cpu.id)}
                          className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-2 text-xs font-medium text-red-300 transition-all duration-200 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-purple-500/20 bg-[#0F172A] p-6 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit CPU" : "Add New CPU"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  CPU Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Intel Core i9-13900K"
                  className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-purple-500/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-purple-500/10 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-purple-500 hover:bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 shadow-lg shadow-purple-500/30"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CPUPage;
