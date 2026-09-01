import React from 'react';
import type { ColorAdjustmentOptions } from './reduceTypes';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Maximize2, Eye, FileText, Sparkles } from 'lucide-react';

export interface ExpandablePreviewCardProps {
  thumbnailUrl: string | null;
  visuals: ColorAdjustmentOptions;
  totalPages: number;
  onExpand: () => void;
}

export const ExpandablePreviewCard: React.FC<ExpandablePreviewCardProps> = ({
  thumbnailUrl,
  visuals,
  totalPages,
  onExpand,
}) => {
  const boostFactor = 1 + (visuals.colorBoostPercent / 100) * 0.35;
  const filterStyle = `grayscale(${visuals.grayscalePercent}%) brightness(${visuals.brightnessPercent}%) contrast(${visuals.contrastPercent * boostFactor}%) saturate(${visuals.saturationPercent * boostFactor}%)`;
  const isAdjusted =
    visuals.grayscalePercent > 0 ||
    visuals.brightnessPercent !== 100 ||
    visuals.contrastPercent !== 100 ||
    visuals.saturationPercent !== 100 ||
    visuals.sharpnessPercent > 0 ||
    visuals.colorBoostPercent > 0 ||
    visuals.textWeightPercent > 0;

  return (
    <Card className="flex flex-col gap-3 p-4 border border-border bg-bg-surface shadow-2xs">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-text-main">
                Preview PDF with Applied Changes
              </h4>
              {isAdjusted && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-emerald-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  Live Effect
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              Real-time rendering of your adjustments before downloading.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExpand}
          leftIcon={<Maximize2 className="h-3.5 w-3.5" />}
          className="text-xs font-semibold hover:border-primary hover:text-primary shrink-0"
        >
          Expand Preview
        </Button>
      </div>

      <div
        onClick={onExpand}
        className="group relative flex flex-col sm:flex-row items-center gap-4 p-2.5 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-100/60 transition-all cursor-pointer"
        title="Click to expand full screen preview"
      >
        <div className="relative h-28 w-20 shrink-0 rounded border border-border bg-white overflow-hidden flex items-center justify-center shadow-xs">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Page 1 Preview"
              className="h-full w-full object-contain transition-all duration-150"
              style={{ filter: filterStyle }}
            />
          ) : (
            <FileText className="h-8 w-8 text-text-muted/40 animate-pulse" />
          )}
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded font-mono">
            p.1
          </span>
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="h-5 w-5 text-white drop-shadow" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">
              Click to view full-page inspection
            </span>
            <span className="text-[10px] text-text-muted">
              ({totalPages || 1} pages total)
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Expand to examine text sharpness, black & white contrast, and color vibrance up close.
          </p>

          <div className="flex flex-wrap gap-1 mt-0.5 justify-center sm:justify-start">
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
              B&W: <strong>{visuals.grayscalePercent}%</strong>
            </span>
            {visuals.sharpnessPercent > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-sky-50 text-sky-800 rounded border border-sky-200">
                Sharp: <strong>+{visuals.sharpnessPercent}%</strong>
              </span>
            )}
            {visuals.colorBoostPercent > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-50 text-purple-800 rounded border border-purple-200">
                Boost: <strong>+{visuals.colorBoostPercent}%</strong>
              </span>
            )}
            {visuals.textWeightPercent > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-300">
                Weight: <strong>+{visuals.textWeightPercent}%</strong>
              </span>
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
              Bright: <strong>{visuals.brightnessPercent}%</strong>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
              Contrast: <strong>{visuals.contrastPercent}%</strong>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
