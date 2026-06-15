import { useState } from "react";

export function useUpgradeAdvisor(userSystem: any | null, averageCompatibility: number | null = null) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecommendations() {
    if (!userSystem) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/ai/upgrade-recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_system: userSystem,
          average_compatibility: averageCompatibility ?? 0.75,
        }),
      });
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const json = await resp.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetchRecommendations };
}

export default useUpgradeAdvisor;
