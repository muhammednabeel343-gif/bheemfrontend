import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import {
  getAdminGames,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,
  uploadAdminGameImage,
} from "../../services/adminHardwareService";
import { Gamepad2, Plus, Edit2, Trash2, X, Search, Upload } from "lucide-react";
import AdminCPUDropdown from "../../components/AdminCPUDropdown";
import AdminGPUDropdown from "../../components/AdminGPUDropdown";
import AdminRAMDropdown from "../../components/AdminRAMDropdown";
import AdminOSDropdown from "../../components/AdminOSDropdown";

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
  storage?: number;
  operating_system?: string;
}

function AdminGamesPage() {
  const { token } = useAdminAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    genre: "",
    release_date: "",
    image_url: "",
    cpu: "",
    gpu: "",
    ram_gb: "",
    storage: "",
    operating_system: "",
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
    setForm({
      name: "",
      genre: "",
      release_date: "",
      image_url: "",
      cpu: "",
      gpu: "",
      ram_gb: "",
      storage: "",
      operating_system: "",
    });
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
      storage: form.storage ? Number(form.storage) : undefined,
      operating_system: form.operating_system || undefined,
    };

    try {
      if (editing) {
        await updateAdminGame(token!, editing.id, payload);
        setGames((prev) =>
          prev.map((g) => (g.id === editing.id ? { ...g, ...payload, id: g.id } : g))
        );
      } else {
        const created = await createAdminGame(token!, payload);
        setGames((prev) => [...prev, created as Game]);
      }
    } finally {
      setShowModal(false);
      setEditing(null);
      setForm({
        name: "",
        genre: "",
        release_date: "",
        image_url: "",
        cpu: "",
        gpu: "",
        ram_gb: "",
        storage: "",
        operating_system: "",
      });
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
      storage: game.storage?.toString() || "",
      operating_system: game.operating_system || "",
    });
    setShowModal(true);
  }, []);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Game Library</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage game compatibility database
          </p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 rounded-lg bg-purple-500 hover:bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 shadow-lg shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Add Game
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-purple-500/20 bg-[#0F172A] px-10 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
        />
      </div>

      {/* Games Grid */}
      {loading && games.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Loading games...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">
            {games.length === 0 ? "No games added yet." : "No results found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative overflow-hidden rounded-lg border border-purple-500/20 bg-[#0F172A] transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 aspect-[2/3]"
            >
              {/* Game Image - Perfect Fill */}
              {game.image_url ? (
                <>
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                  <Gamepad2 className="h-16 w-16 text-purple-400/50" />
                </div>
              )}

              {/* Content - Overlay on bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white truncate">
                  {game.name}
                </h3>
                <p className="text-xs text-purple-300">{game.genre}</p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(game)}
                  className="flex items-center justify-center rounded-lg bg-blue-500/80 hover:bg-blue-500 border border-blue-400/50 p-2 text-white transition-all duration-200"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="flex items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-500 border border-red-400/50 p-2 text-white transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-lg border border-purple-500/20 bg-[#0F172A] p-6 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Game" : "Add New Game"}
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
                  Game Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Cyberpunk 2077"
                  className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    placeholder="e.g., RPG"
                    className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={form.release_date}
                    onChange={(e) => setForm({ ...form, release_date: e.target.value })}
                    className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    CPU
                  </label>
                  <AdminCPUDropdown
                    value={form.cpu}
                    onChange={(value) => setForm({ ...form, cpu: value })}
                    token={token!}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    GPU
                  </label>
                  <AdminGPUDropdown
                    value={form.gpu}
                    onChange={(value) => setForm({ ...form, gpu: value })}
                    token={token!}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    RAM (GB)
                  </label>
                  <AdminRAMDropdown
                    value={form.ram_gb}
                    onChange={(value) => setForm({ ...form, ram_gb: value.toString() })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Storage (GB)
                  </label>
                  <input
                    type="number"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    placeholder="e.g., 100"
                    className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Operating System
                </label>
                <AdminOSDropdown
                  value={form.operating_system}
                  onChange={(value) => setForm({ ...form, operating_system: value })}
                  token={token!}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Game Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 px-4 py-8 text-sm font-medium text-purple-300 cursor-pointer transition-all duration-200"
                  >
                    <Upload className="h-4 w-4" />
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </label>
                </div>
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

export default AdminGamesPage;
