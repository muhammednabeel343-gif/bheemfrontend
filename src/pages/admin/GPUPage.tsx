import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface GPU {
  id: number;
  name: string;
}

function GPUPage() {
  const { token } = useAdminAuth();
  const [gpus, setGPUs] = useState<GPU[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GPU | null>(null);
  const [name, setName] = useState("");

  const fetchGPUs = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/gpus`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setGPUs)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchGPUs();
  }, [fetchGPUs]);

  const handleSave = useCallback(async () => {
    const url = editing ? `/admin/gpus/${editing.id}` : "/admin/gpus";
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
        setGPUs((prev) => prev.map((g) => (g.id === editing.id ? { ...g, name } : g)));
      } else {
        const created = await res.json();
        setGPUs((prev) => [...prev, created]);
      }
    }
  }, [token, editing, name]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this GPU?")) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/gpus/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setGPUs((prev) => prev.filter((g) => g.id !== id));
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">GPUs</h1>
        <button
          onClick={() => { setEditing(null); setName(""); setShowModal(true); }}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add GPU
        </button>
      </div>

      {loading && gpus.length === 0 ? (
        <div className="text-slate-600">Loading...</div>
      ) : gpus.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No GPUs added yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gpus.map((gpu) => (
            <div key={gpu.id} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-slate-900">{gpu.name}</h3>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => { setEditing(gpu); setName(gpu.name); setShowModal(true); }}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gpu.id)}
                  className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              {editing ? "Edit GPU" : "Add GPU"}
            </h2>
            <div>
              <span className="text-sm font-medium text-slate-700">GPU name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="GPU name"
                className="mt-1 w-full rounded-2xl border border-slate-200 p-3 mb-4"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
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

export default GPUPage;
