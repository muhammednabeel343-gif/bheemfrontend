import { useState, useEffect } from "react";

export function useAIExplanation(
  gameName: string | null,
  gameRequirements: any | null,
  userSystem: any | null,
  compatibilityScore: number | null
) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchExplanation() {
      if (!gameName || !gameRequirements || !userSystem || compatibilityScore === null) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/ai/compatibility-explanation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game_name: gameName,
            game_requirements: gameRequirements,
            user_system: userSystem,
            compatibility_score: compatibilityScore,
          }),
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json = await resp.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load explanation");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchExplanation();
    return () => {
      mounted = false;
    };
  }, [gameName, gameRequirements, userSystem, compatibilityScore]);

  return { data, loading, error };
}

export default useAIExplanation;
