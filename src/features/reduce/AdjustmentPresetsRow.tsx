import React from 'react';
import type { ColorAdjustmentOptions } from './reduceTypes';
import { RotateCcw, FileText, Sparkles } from 'lucide-react';

export interface AdjustmentPresetsRowProps {
  visuals: ColorAdjustmentOptions;
  disabled?: boolean;
  onApplyPreset: (patch: Partial<ColorAdjustmentOptions>) => void;
}

export const AdjustmentPresetsRow: React.FC<AdjustmentPresetsRowProps> = ({
  visuals,
  disabled = false,
  onApplyPreset,
}) => {
  const isCustomized =
    visuals.grayscalePercent > 0 ||
    visuals.brightnessPercent !== 100 ||
    visuals.contrastPercent !== 100 ||
    visuals.saturationPercent !== 100 ||
    visuals.sharpnessPercent > 0 ||
    visuals.colorBoostPercent > 0 ||
    visuals.textWeightPercent > 0;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onApplyPreset({
            grayscalePercent: 100,
            brightnessPercent: 105,
            contrastPercent: 135,
            saturationPercent: 0,
            sharpnessPercent: 40,
            colorBoostPercent: 30,
            textWeightPercent: 40,
          })
        }
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
          visuals.grayscalePercent === 100
            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
            : 'bg-bg-subtle text-text-sub hover:bg-slate-200 border-border'
        }`}
      >
        <FileText className="h-3 w-3 inline mr-1" />
        B&W Scan
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onApplyPreset({
            grayscalePercent: 0,
            brightnessPercent: 100,
            contrastPercent: 120,
            saturationPercent: 130,
            sharpnessPercent: 30,
            colorBoostPercent: 60,
            textWeightPercent: 25,
          })
        }
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
          visuals.colorBoostPercent >= 50
            ? 'bg-primary text-white border-primary shadow-xs'
            : 'bg-bg-subtle text-text-sub hover:bg-slate-200 border-border'
        }`}
      >
        <Sparkles className="h-3 w-3 inline mr-1" />
        Deep Color & Darks
      </button>

      {isCustomized && (
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onApplyPreset({
              grayscalePercent: 0,
              brightnessPercent: 100,
              contrastPercent: 100,
              saturationPercent: 100,
              sharpnessPercent: 0,
              colorBoostPercent: 0,
              textWeightPercent: 0,
            })
          }
          className="px-2 py-1 rounded text-[11px] font-semibold text-primary hover:bg-primary/10 border border-primary/30 transition-all flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3 text-primary" />
          Reset
        </button>
      )}
    </div>
  );
};
