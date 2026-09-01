import React from 'react';
import { Sliders, Gauge, HardDrive } from 'lucide-react';

export interface ReduceSlidersProps {
  qualityPercent: number;
  targetMb: number;
  actualSizeMb: number;
  disabled?: boolean;
  onQualityChange: (quality: number) => void;
  onTargetMbChange: (mb: number) => void;
}

export const ReduceSliders: React.FC<ReduceSlidersProps> = ({
  qualityPercent,
  targetMb,
  actualSizeMb,
  disabled = false,
  onQualityChange,
  onTargetMbChange,
}) => {
  const minMb = Math.max(0.05, Math.round((actualSizeMb * 0.1) * 100) / 100);
  const maxMb = Math.max(minMb + 0.1, actualSizeMb);

  const handleQualityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 5;
    onQualityChange(val);
    // Sync target MB
    const estimatedRatio = 0.15 + (val / 100) * 0.85;
    const estMb = Math.round(actualSizeMb * estimatedRatio * 100) / 100;
    onTargetMbChange(Math.max(minMb, Math.min(estMb, maxMb)));
  };

  const handleMbInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || minMb;
    onTargetMbChange(val);
    // Sync quality
    const ratio = Math.max(0.05, Math.min(1.0, val / Math.max(0.01, actualSizeMb)));
    const quality = Math.round(ratio * 100);
    onQualityChange(Math.max(5, Math.min(100, quality)));
  };

  return (
    <div className="flex flex-col gap-5 rounded border border-border bg-bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <h3 className="text-xs font-bold text-text-main flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5 text-primary" />
          Quality & Target Size
        </h3>
        <span className="text-xs text-text-muted">
          Original: <strong className="text-text-main">{actualSizeMb.toFixed(2)} MB</strong>
        </span>
      </div>

      {/* Slider 1: Quality Percentage */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-main flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            Quality:
          </span>
          <span className="font-mono font-bold text-primary text-xs">{qualityPercent}%</span>
        </div>

        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={qualityPercent}
          onChange={handleQualityInput}
          disabled={disabled}
          className="h-1.5 w-full cursor-pointer accent-primary bg-bg-subtle rounded border border-border"
        />

        <div className="flex justify-between text-[10px] text-text-muted">
          <span>Low</span>
          <span>Balanced (50%)</span>
          <span>High</span>
          <span>Max</span>
        </div>
      </div>

      {/* Slider 2: Target Size in MB */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-main flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-primary" />
            Target Size:
          </span>
          <span className="font-mono font-bold text-primary text-xs">{targetMb.toFixed(2)} MB</span>
        </div>

        <input
          type="range"
          min={minMb}
          max={maxMb}
          step="0.05"
          value={targetMb}
          onChange={handleMbInput}
          disabled={disabled}
          className="h-1.5 w-full cursor-pointer accent-primary bg-bg-subtle rounded border border-border"
        />

        <div className="flex justify-between text-[10px] text-text-muted">
          <span>Min: ~{minMb.toFixed(2)} MB</span>
          <span>Max: {maxMb.toFixed(2)} MB</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border">
        <span className="text-[11px] font-semibold text-text-sub">Presets:</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onQualityChange(35);
            onTargetMbChange(Math.max(minMb, Math.round(actualSizeMb * 0.35 * 100) / 100));
          }}
          className="px-2 py-0.5 text-[11px] rounded border border-border bg-bg-subtle hover:bg-border text-text-main font-medium"
        >
          Low (35%)
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onQualityChange(65);
            onTargetMbChange(Math.max(minMb, Math.round(actualSizeMb * 0.65 * 100) / 100));
          }}
          className="px-2 py-0.5 text-[11px] rounded border border-primary/40 bg-sky-50 hover:bg-sky-100 text-primary font-medium"
        >
          Balanced (65%)
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onQualityChange(85);
            onTargetMbChange(Math.max(minMb, Math.round(actualSizeMb * 0.85 * 100) / 100));
          }}
          className="px-2 py-0.5 text-[11px] rounded border border-border bg-bg-subtle hover:bg-border text-text-main font-medium"
        >
          High (85%)
        </button>
      </div>
    </div>
  );
};
