import React from 'react';
import { Eye, FileText, Sparkles } from 'lucide-react';

export interface LiveFilterPreviewProps {
  thumbnailUrl: string | null;
  grayscalePercent: number;
  brightnessPercent: number;
  contrastPercent: number;
  saturationPercent: number;
}

export const LiveFilterPreview: React.FC<LiveFilterPreviewProps> = ({
  thumbnailUrl,
  grayscalePercent,
  brightnessPercent,
  contrastPercent,
  saturationPercent,
}) => {
  const filterStyle = `grayscale(${grayscalePercent}%) brightness(${brightnessPercent}%) contrast(${contrastPercent}%) saturate(${saturationPercent}%)`;
  const isAdjusted =
    grayscalePercent > 0 ||
    brightnessPercent !== 100 ||
    contrastPercent !== 100 ||
    saturationPercent !== 100;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-border bg-bg-surface p-3 shadow-2xs">
      <div className="relative h-32 w-24 shrink-0 rounded border border-border bg-slate-100 overflow-hidden flex items-center justify-center shadow-xs">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Live Preview"
            className="h-full w-full object-contain transition-all duration-150"
            style={{ filter: filterStyle }}
          />
        ) : (
          <FileText className="h-8 w-8 text-text-muted/40 animate-pulse" />
        )}
        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded font-mono">
          Page 1
        </span>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <Eye className="h-3.5 w-3.5 text-primary" />
          <h5 className="text-xs font-bold text-text-main">Real-Time Visual Preview</h5>
          {isAdjusted && (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-emerald-300">
              <Sparkles className="h-2.5 w-2.5" />
              Adjusted
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted">
          Real-time preview of page 1 with active black & white, brightness, contrast, and saturation filters.
        </p>
        <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
            B&W: <strong>{grayscalePercent}%</strong>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
            Bright: <strong>{brightnessPercent}%</strong>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
            Contrast: <strong>{contrastPercent}%</strong>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-subtle rounded border border-border text-text-sub">
            Sat: <strong>{saturationPercent}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
