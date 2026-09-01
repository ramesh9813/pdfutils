import React, { useMemo } from 'react';
import { parseRangeString } from '../../features/split/rangeParser';
import { Scissors } from 'lucide-react';

export interface RangeSliceConfigProps {
  customRanges: string;
  splitPoints: number[];
  totalPages: number;
  disabled?: boolean;
  selectedSectionIndices: number[];
  onSetCustomRanges: (ranges: string) => void;
  onToggleSectionIndex: (index: number) => void;
  onSelectAllSections: (total: number) => void;
  onDeselectAllSections: () => void;
}

export const RangeSliceConfig: React.FC<RangeSliceConfigProps> = ({
  customRanges,
  splitPoints,
  totalPages,
  disabled = false,
  selectedSectionIndices,
  onSetCustomRanges,
  onToggleSectionIndex,
  onSelectAllSections,
  onDeselectAllSections,
}) => {
  const rangeValidation = useMemo(() => {
    return parseRangeString(customRanges, totalPages);
  }, [customRanges, totalPages]);

  const ranges = rangeValidation.valid ? rangeValidation.ranges : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label className="font-semibold text-text-main flex items-center gap-1.5 text-xs" htmlFor="range-input">
          <Scissors className="h-3.5 w-3.5 text-primary" />
          <span>Python Slices:</span>
        </label>
        <span className="text-[11px] font-mono text-primary font-semibold">
          {splitPoints.length} Cuts • {ranges.length} Parts
        </span>
      </div>

      <input
        id="range-input"
        type="text"
        value={customRanges}
        onChange={(e) => onSetCustomRanges(e.target.value)}
        disabled={disabled}
        placeholder="1:5, 6:9, 10:50"
        className={`w-full rounded border px-3 py-2 text-xs font-mono bg-bg-surface text-text-main outline-none focus:border-primary ${
          !rangeValidation.valid ? 'border-danger' : 'border-border'
        }`}
      />

      {!rangeValidation.valid ? (
        <p className="text-[11px] text-danger">{rangeValidation.error}</p>
      ) : (
        <p className="text-[11px] text-text-muted">
          Format: <code className="bg-bg-subtle px-1 py-0.5 rounded text-primary font-semibold">1:5, 6:9</code> (start:end)
        </p>
      )}

      {/* Quick helper buttons */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={() => onSetCustomRanges(`1:${Math.ceil(totalPages / 2)}, ${Math.ceil(totalPages / 2) + 1}:${totalPages}`)}
          disabled={disabled}
          className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px] font-mono"
        >
          Halves
        </button>
        <button
          type="button"
          onClick={() => onSetCustomRanges(`1:${totalPages}`)}
          disabled={disabled}
          className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px] font-mono"
        >
          Full (1:{totalPages})
        </button>
      </div>

      {/* Selective Download Checkboxes for Split Sections */}
      {ranges.length > 0 && (
        <div className="flex flex-col gap-2 rounded border border-border/80 bg-bg-subtle/40 p-2.5 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-main">
              Keep Sections:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectAllSections(ranges.length)}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                All ({ranges.length})
              </button>
              <span className="text-text-muted">•</span>
              <button
                type="button"
                onClick={onDeselectAllSections}
                className="text-[11px] text-text-sub hover:underline font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {ranges.map((r, idx) => {
              const isChecked = selectedSectionIndices.includes(idx);
              const pCount = r.end - r.start + 1;
              return (
                <label
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-xs transition-colors select-none ${
                    isChecked
                      ? 'bg-white border-primary text-text-main shadow-2xs'
                      : 'bg-bg-surface border-border text-text-muted opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSectionIndex(idx)}
                    className="accent-primary h-3.5 w-3.5 rounded"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[11px]">Part {idx + 1}</span>
                    <span className="font-mono text-[10px] text-primary">
                      Pages {r.start}:{r.end} ({pCount} pp)
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
