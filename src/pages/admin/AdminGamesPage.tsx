import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { getAdminGames, createAdminGame, updateAdminGame, deleteAdminGame, uploadAdminGameImage } from "../../services/adminHardwareService";

interface Game {
  id: number;
  name: string;
  description?: string;
  genre: string;
  publisher?: string;
  release_date?: string;
  image_url?: string;
  cpu: string;
  gpu: string;
  ram_gb?: number;
}

function AdminGamesPage() {
  const { token } = useAdminAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);

  const [form, setForm] = useState({
    name: "",
    genre: "",
    release_date: "",
    image_url: "",
    cpu: "",
    gpu: "",
    ram_gb: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchGames = useCallback(() => {
    if (!token) return;
    setLoading(true);
    getAdminGames(token)
      .then((data) => setGames((data.games as Game[]).filter(Boolean)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const resetForm = useCallback(() => {
    setEditing(null);
    setForm({ name: "", genre: "", release_date: "", image_url: "", cpu: "", gpu: "", ram_gb: "" });
    setImageFile(null);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(async () => {
    let image_url = form.image_url;

    if (imageFile) {
      try {
        const upload = await uploadAdminGameImage(token!, imageFile);
        image_url = upload.url;
      } catch (err) {
        alert("Image upload failed. Saving without image.");
        image_url = "";
      }
    }

    const payload = {
      name: form.name,
      genre: form.genre,
      release_date: form.release_date || undefined,
      image_url: image_url || undefined,
      cpu: form.cpu,
      gpu: form.gpu,
      ram_gb: form.ram_gb ? Number(form.ram_gb) : undefined,
    };

    try {
      if (editing) {
        await updateAdminGame(token!, editing.id, payload);
        setGames((prev) => prev.map((g) => (g.id === editing.id ? { ...g, ...payload, id: g.id } : g)));
      } else {
        const created = await createAdminGame(token!, payload);
        setGames((prev) => [...prev, created as Game]);
      }
    } finally {
      setShowModal(false);
      setEditing(null);
      setForm({ name: "", genre: "", release_date: "", image_url: "", cpu: "", gpu: "", ram_gb: "" });
      setImageFile(null);
    }
  }, [token, editing, form, imageFile]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this game?")) return;
    try {
      await deleteAdminGame(token!, id);
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch {
      fetchGames();
    }
  }, [token, fetchGames]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setForm((prev) => ({ ...prev, image_url: file.name }));
    }
  };

  const startEdit = useCallback((game: Game) => {
    setEditing(game);
    setForm({
      name: game.name,
      genre: game.genre || "",
      release_date: game.release_date || "",
      image_url: game.image_url || "",
      cpu: game.cpu || "",
      gpu: game.gpu || "",
      ram_gb: game.ram_gb?.toString() || "",
    });
    setShowModal(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Games</h1>
        <button
          onClick={resetForm}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add Game
        </button>
      </div>

      {loading && games.length === 0 ? (
        <div className="text-slate-600">Loading...</div>
      ) : games.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No games added yet.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white">
              {game.image_url ? (
                <img src={game.image_url} alt={game.name} className="h-48 w-full rounded-t-3xl object-cover" />
              ) : (
                <div className="h-48 w-full rounded-t-3xl bg-slate-100" />
              )}
              <div className="flex-1 p-4 space-y-2">
                <h3 className="font-semibold text-slate-900">{game.name}</h3>
                <p className="text-sm text-slate-600">{game.genre}</p>
                <p className="text-xs text-slate-500">CPU: {game.cpu}</p>
                <p className="text-xs text-slate-500">GPU: {game.gpu}</p>
                <p className="text-xs text-slate-500">RAM: {game.ram_gb} GB</p>
              </div>
              <div className="flex justify-between p-4 pt-0">
                <button
                  onClick={() => startEdit(game)}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
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
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">{editing ? "Edit Game" : "Add Game"}</h2>
            <div className="space-y-4 max-h-[70vh] overflow-auto">
              <div>
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Genre</span>
                <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Genre" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Release Date</span>
                <input value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} type="date" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Image File</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 w-full rounded-2xl border border-slate-200 p-2 text-sm text-slate-700" />
                {form.image_url && <p className="mt-1 text-xs text-slate-500">Selected: {form.image_url}</p>}
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">CPU</span>
                <input value={form.cpu} onChange={(e) => setForm({ ...form, cpu: e.target.value })} placeholder="Minimum CPU" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">GPU</span>
                <input value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} placeholder="Minimum GPU" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Minimum RAM (GB)</span>
                <input type="number" value={form.ram_gb} onChange={(e) => setForm({ ...form, ram_gb: e.target.value })} placeholder="Minimum RAM (GB)" className="mt-1 w-full rounded-2xl border border-slate-200 p-3" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGamesPage;
