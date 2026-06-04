import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

export async function getCPUs(token: string) {
  const response = await api.get("/admin/cpus", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getCPU(id: number, token: string) {
  const response = await api.get(`/admin/cpus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createCPU(token: string, name: string) {
  const response = await api.post(
    "/admin/cpus",
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateCPU(token: string, id: number, name: string) {
  const response = await api.put(
    `/admin/cpus/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteCPU(token: string, id: number) {
  await api.delete(`/admin/cpus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getGPUs(token: string) {
  const response = await api.get("/admin/gpus", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getGPU(id: number, token: string) {
  const response = await api.get(`/admin/gpus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createGPU(token: string, name: string) {
  const response = await api.post(
    "/admin/gpus",
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateGPU(token: string, id: number, name: string) {
  const response = await api.put(
    `/admin/gpus/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteGPU(token: string, id: number) {
  await api.delete(`/admin/gpus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRAMs(token: string) {
  const response = await api.get("/admin/rams", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getRAM(id: number, token: string) {
  const response = await api.get(`/admin/rams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createRAM(token: string, size: number) {
  const response = await api.post(
    "/admin/rams",
    { size },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateRAM(token: string, id: number, size: number) {
  const response = await api.put(
    `/admin/rams/${id}`,
    { size },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteRAM(token: string, id: number) {
  await api.delete(`/admin/rams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getStorages(token: string) {
  const response = await api.get("/admin/storages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getStorage(id: number, token: string) {
  const response = await api.get(`/admin/storages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createStorage(token: string, size: number) {
  const response = await api.post(
    "/admin/storages",
    { size },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateStorage(token: string, id: number, size: number) {
  const response = await api.put(
    `/admin/storages/${id}`,
    { size },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteStorage(token: string, id: number) {
  await api.delete(`/admin/storages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDashboardStats(token: string) {
  const response = await api.get("/admin/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function uploadAdminGameImage(token: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const response = await api.post("/admin/upload-image", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getAdminGames(token: string, page: number = 1, limit: number = 50) {
  const response = await api.get("/admin/games", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit },
  });
  return response.data;
}

export async function getAdminGame(id: number, token: string) {
  const response = await api.get(`/admin/games/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createAdminGame(
  token: string,
  data: {
    name: string;
    genre: string;
    release_date?: string;
    image_url?: string;
    cpu?: string;
    gpu?: string;
    ram_gb?: number;
  }
) {
  const response = await api.post("/admin/games", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateAdminGame(
  token: string,
  id: number,
  data: {
    name?: string;
    genre?: string;
    release_date?: string;
    image_url?: string;
    cpu?: string;
    gpu?: string;
    ram_gb?: number;
  }
) {
  const response = await api.put(`/admin/games/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteAdminGame(token: string, id: number) {
  await api.delete(`/admin/games/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}