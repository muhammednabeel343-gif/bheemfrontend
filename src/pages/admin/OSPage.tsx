import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Monitor, Plus, Edit2, Trash2, X, Search } from "lucide-react";

interface OS {
  id: number;
  name: string;
}

function OSPage() {
  const { token } = useAdminAuth();
  const [oses, setOSes] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<OS | null>(null);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOSes = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/os`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOSes)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchOSes();
  }, [fetchOSes]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter an OS name");
      return;
    }

    const url = editing ? `/admin/os/${editing.id}` : "/admin/os";
    const method = editing ? "PUT" : "POST";

    try {
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error: ${errorData.detail || "Failed to save OS"}`);
        return;
      }

      setShowModal(false);
      setEditing(null);
      setName("");
      fetchOSes();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to save OS"}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this OS option?")) return;
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/os/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchOSes();
  };

  const openAddModal = () => {
    setEditing(null);
    setName("");
    setShowModal(true);
  };

  const openEditModal = (os: OS) => {
    setEditing(os);
    setName(os.name);
    setShowModal(true);
  };

  const filteredOSes = oses.filter((os) =>
    os.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Operating Systems</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage operating system options
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-purple-500 hover:bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 shadow-lg shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Add OS
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search OS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Operating System
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOSes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                    No operating systems found
                  </td>
                </tr>
              ) : (
                filteredOSes.map((os) => (
                  <tr key={os.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-4 w-4 text-orange-400" />
                        <span className="text-white">{os.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(os)}
                          className="rounded p-2 text-slate-400 hover:bg-slate-600 hover:text-yellow-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(os.id)}
                          className="rounded p-2 text-slate-400 hover:bg-slate-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit OS" : "Add New OS"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                OS Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Windows 11"
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="flex-1 rounded-lg border border-slate-600 px-4 py-2 font-medium text-white hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-lg bg-purple-500 px-4 py-2 font-medium text-white hover:bg-purple-600 transition-colors"
              >
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OSPage;
