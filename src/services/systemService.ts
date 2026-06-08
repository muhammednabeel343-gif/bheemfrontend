import axios from "axios";
import type { CompatibilityReport, SystemScan } from "../types/game";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function getSystemScan(token: string): Promise<SystemScan> {
  try {
    const response = await api.get("/system/scan", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("getSystemScan error", err);
    throw formatAxiosError(err);
  }
}

export async function saveSystemScan(
  token: string,
  payload: SystemScan & { game_id?: number }
): Promise<SystemScan> {
  try {
    const response = await api.post("/system/save-scan", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("saveSystemScan error", err);
    throw formatAxiosError(err);
  }
}

export async function deleteSystemScan(token: string): Promise<void> {
  try {
    await api.delete("/system/delete-scan", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err: any) {
    console.error("deleteSystemScan error", err);
    throw formatAxiosError(err);
  }
}

export async function getCompatibilityReport(
  token: string,
  gameId: number
): Promise<CompatibilityReport> {
  try {
    const response = await api.post(
      `/games/${gameId}/compatibility`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (err: any) {
    console.error("getCompatibilityReport error", err);
    throw formatAxiosError(err);
  }
}

export async function getCpuOptions(token: string) {
  const response = await api.get("/system/hardware/cpus", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data
  return Array.isArray(data)
    ? data.map((item: any, idx: number) => ({
        id: idx,
        name: item.name || item,
        benchmark_score: item.score || 0,
      }))
    : []
}

export async function getGpuOptions(token: string) {
  const response = await api.get("/system/hardware/gpus", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data
  return Array.isArray(data)
    ? data.map((item: any, idx: number) => ({
        id: idx,
        name: item.name || item,
        benchmark_score: item.score || 0,
      }))
    : []
}

export async function getRamOptions(token?: string) {
  const response = await api.get("/system/hardware/rams");
  return response.data
}

export async function getStorageOptions(token: string) {
  const response = await api.get("/system/hardware/storages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((s: any) => ({ value: s.size, label: `${s.size} GB` }));
}

export async function getOsOptions(token: string) {
  const response = await api.get("/system/hardware/oses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data
  return Array.isArray(data)
    ? data.map((item: any, idx: number) => ({
        id: idx,
        name: item.name || item,
      }))
    : []
}

export async function simulateCompatibility(
  token: string,
  payload: { game_id: number; cpu: string; gpu: string; ram_gb: number; storage_gb: number; operating_system: string }
) {
  const response = await api.post("/system/simulate", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getScans(token: string) {
  try {
    const response = await api.get("/system/scans", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("getScans error", err);
    throw formatAxiosError(err);
  }
}

export async function getLatestScan(token: string) {
  try {
    const response = await api.get("/system/scans/latest", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("getLatestScan error", err);
    throw formatAxiosError(err);
  }
}

function formatAxiosError(err: any) {
  if (!err) return new Error("Unknown network error");
  if (err.response) {
    const status = err.response.status;
    const detail = err.response.data?.detail || JSON.stringify(err.response.data);
    return new Error(`HTTP ${status}: ${detail}`);
  }
  if (err.request) {
    return new Error("No response received from server (network error or CORS)");
  }
  return new Error(err.message || "Network error");
}