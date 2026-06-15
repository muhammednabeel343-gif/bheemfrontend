import React from "react";

type Option = {
  component: string;
  current: any;
  suggested: any;
  cost_estimate?: string;
  expected_gain_pct?: number;
};

type Props = {
  data: { bottleneck?: string; options?: Option[] } | null;
  loading?: boolean;
  onRefresh?: () => void;
};

export const UpgradeAdvisorWidget: React.FC<Props> = ({ data, loading, onRefresh }) => {
  return (
    <div className="bg-game-card p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Upgrade Advisor</h3>
        {onRefresh && (
          <button onClick={onRefresh} className="text-sm text-game-text-secondary underline">
            Refresh
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-game-text-secondary">Loading recommendations...</p>}

      {!loading && !data && <p className="text-sm text-game-text-secondary">No recommendations available.</p>}

      {data && (
        <div>
          <p className="mb-2">Primary bottleneck: <strong>{data.bottleneck || 'unknown'}</strong></p>
          <ul className="space-y-2">
            {(data.options || []).map((opt: Option, idx: number) => (
              <li key={idx} className="p-2 bg-game-surface rounded">
                <div className="text-sm">{opt.component}: <strong>{opt.suggested}</strong></div>
                <div className="text-xs text-game-text-secondary">Cost: {opt.cost_estimate} • Gain: {opt.expected_gain_pct}%</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpgradeAdvisorWidget;
