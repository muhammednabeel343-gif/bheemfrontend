import React from "react";

type Props = {
  summary?: string;
  details?: any;
};

export const AIExplanationCard: React.FC<Props> = ({ summary, details }) => {
  if (!summary && !details) return null;
  return (
    <div className="bg-game-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Compatibility Explanation</h3>
      {summary && <p className="text-sm text-game-text-secondary mb-2">{summary}</p>}
      {details && (
        <pre className="text-xs bg-game-surface p-2 rounded overflow-auto">{JSON.stringify(details, null, 2)}</pre>
      )}
    </div>
  );
};

export default AIExplanationCard;
