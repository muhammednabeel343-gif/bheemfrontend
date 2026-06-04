import { useEffect, useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface RAM {
  id: number;
  size: number;
}

function RAMPage() {
  const { token } = useAdminAuth();
  const [rams, setRAMs] = useState<RAM[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RAM | null>(null);
  const [size, setSize] = useState(0);

  const fetchRAMs = () => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/rams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRAMs)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRAMs();
  }, [token]);

  const handleSave = async () => {
    const url = editing ? `/admin/rams/${editing.id}` : "/admin/rams";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${url}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size }),
      }
    );

    if (res.ok) {
      setShowModal(false);
      setEditing(null);
      setSize(0);
      fetchRAMs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this RAM option?")) return;
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/rams/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchRAMs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">RAM Options</h1>
        <button
          onClick={() => { setEditing(null); setSize(0); setShowModal(true); }}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add RAM
        </button>
      </div>

      {loading ? (
        <div className="text-slate-600">Loading...</div>
      ) : rams.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No RAM options added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rams.map((ram) => (
            <div key={ram.id} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 text-center">
                <span className="text-3xl font-bold text-slate-900">{ram.size} GB</span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => { setEditing(ram); setSize(ram.size); setShowModal(true); }}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ram.id)}
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
              {editing ? "Edit RAM" : "Add RAM"}
            </h2>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              placeholder="RAM size (GB)"
              className="w-full rounded-2xl border border-slate-200 p-3 mb-4"
            />
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

export default RAMPage;