import React, { useMemo } from 'react';
import type { SplitOptions, SplitMode, ProgressState, SplitOutput } from '../../types/pdf.types';
import { parseRangeString } from '../../features/split/rangeParser';
import { SplitModeSelector } from './SplitModeSelector';
import { RangeSliceConfig } from './RangeSliceConfig';
import { SplitSummaryAndAction } from './SplitSummaryAndAction';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RotateCcw } from 'lucide-react';

export interface SplitConfigPanelProps {
  options: SplitOptions;
  totalPages: number;
  isProcessing: boolean;
  progress: ProgressState;
  result: SplitOutput | null;
  selectedSectionIndices: number[];
  onSetMode: (mode: SplitMode) => void;
  onSetCustomRanges: (ranges: string) => void;
  onSetEveryN: (everyN: number) => void;
  onSetMergeExtracted: (merge: boolean) => void;
  onSetFilenamePrefix: (prefix: string) => void;
  onToggleSectionIndex: (index: number) => void;
  onSelectAllSections: (total: number) => void;
  onDeselectAllSections: () => void;
  onExecuteSplit: () => void;
  onDownload: () => void;
  onResetSplit: () => void;
}

export const SplitConfigPanel: React.FC<SplitConfigPanelProps> = ({
  options,
  totalPages,
  isProcessing,
  progress,
  result,
  selectedSectionIndices,
  onSetMode,
  onSetCustomRanges,
  onSetEveryN,
  onSetMergeExtracted,
  onSetFilenamePrefix,
  onToggleSectionIndex,
  onSelectAllSections,
  onDeselectAllSections,
  onExecuteSplit,
  onDownload,
  onResetSplit,
}) => {
  const rangeValidation = useMemo(() => {
    if (options.mode !== 'range') return { valid: true, ranges: [] };
    return parseRangeString(options.customRanges, totalPages);
  }, [options.mode, options.customRanges, totalPages]);

  const outputSummary = useMemo(() => {
    switch (options.mode) {
      case 'extract': {
        const count = options.selectedPages.length;
        if (count === 0) return 'Select pages below.';
        return options.mergeExtracted
          ? `1 merged PDF with ${count} page(s).`
          : `${count} separate PDFs in ZIP.`;
      }
      case 'range': {
        if (!rangeValidation.valid || rangeValidation.ranges.length === 0) {
          return 'Enter valid slices.';
        }
        const activeCount = selectedSectionIndices.length;
        const totalSections = rangeValidation.ranges.length;
        return activeCount === 1
          ? `1 PDF (${activeCount} of ${totalSections} parts kept).`
          : `${activeCount} PDFs in ZIP (${activeCount} of ${totalSections} parts kept).`;
      }
      case 'single':
        return `All ${totalPages} pages into individual PDFs in ZIP.`;
      case 'every_n': {
        const parts = Math.ceil(totalPages / (options.everyN || 1));
        return `${parts} PDFs (up to ${options.everyN} pp each) in ZIP.`;
      }
    }
  }, [options, totalPages, rangeValidation, selectedSectionIndices]);

  const canExecute = useMemo(() => {
    if (isProcessing) return false;
    if (options.mode === 'extract') return options.selectedPages.length > 0;
    if (options.mode === 'range') return rangeValidation.valid && selectedSectionIndices.length > 0;
    if (options.mode === 'every_n') return options.everyN >= 1;
    return true;
  }, [isProcessing, options, rangeValidation, selectedSectionIndices]);

  return (
    <Card className="flex flex-col gap-4 border border-border bg-bg-surface p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div>
          <h2 className="text-base font-bold text-text-main">Split Setup</h2>
          <p className="text-xs text-text-muted">Choose split mode and options.</p>
        </div>
        {result && (
          <Button type="button" variant="outline" size="sm" onClick={onResetSplit} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset
          </Button>
        )}
      </div>

      <SplitModeSelector mode={options.mode} disabled={isProcessing} onSelectMode={onSetMode} />

      <div className="flex flex-col gap-3 pt-1">
        {options.mode === 'extract' && (
          <div className="flex flex-col gap-2 rounded border border-border bg-bg-subtle/50 p-2.5 text-xs">
            <span className="font-semibold text-text-main">Format:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="extract-format" checked={options.mergeExtracted} onChange={() => onSetMergeExtracted(true)} disabled={isProcessing} className="accent-primary" />
              <span>Merge into <strong>1 PDF</strong></span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="extract-format" checked={!options.mergeExtracted} onChange={() => onSetMergeExtracted(false)} disabled={isProcessing} className="accent-primary" />
              <span>Separate PDFs <strong>(.ZIP)</strong></span>
            </label>
          </div>
        )}

        {options.mode === 'range' && (
          <RangeSliceConfig
            customRanges={options.customRanges}
            splitPoints={options.splitPoints}
            totalPages={totalPages}
            disabled={isProcessing}
            selectedSectionIndices={selectedSectionIndices}
            onSetCustomRanges={onSetCustomRanges}
            onToggleSectionIndex={onToggleSectionIndex}
            onSelectAllSections={onSelectAllSections}
            onDeselectAllSections={onDeselectAllSections}
          />
        )}

        {options.mode === 'every_n' && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-text-main" htmlFor="every-n-input">Pages per Document:</label>
            <input
              id="every-n-input"
              type="number"
              min={1}
              max={totalPages}
              value={options.everyN}
              onChange={(e) => onSetEveryN(Math.max(1, parseInt(e.target.value, 10) || 1))}
              disabled={isProcessing}
              className="w-20 rounded border border-border px-2 py-1 text-xs font-mono font-bold text-center"
            />
          </div>
        )}
      </div>

      <SplitSummaryAndAction
        summaryText={outputSummary}
        filenamePrefix={options.filenamePrefix}
        canExecute={canExecute}
        isProcessing={isProcessing}
        progress={progress}
        result={result}
        onSetFilenamePrefix={onSetFilenamePrefix}
        onExecuteSplit={onExecuteSplit}
        onDownload={onDownload}
      />
    </Card>
  );
};
