import React, { useMemo } from 'react';
import type {
  SplitOptions,
  SplitMode,
  SplitRange,
  ProgressState,
  SplitOutput,
} from '../../types/pdf.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { parseRangeString } from '../../services/pdfSplitter';
import {
  Scissors,
  CheckSquare,
  Layers,
  FileArchive,
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export interface SplitConfigPanelProps {
  options: SplitOptions;
  totalPages: number;
  isProcessing: boolean;
  progress: ProgressState;
  result: SplitOutput | null;
  onSetMode: (mode: SplitMode) => void;
  onSetCustomRanges: (ranges: string) => void;
  onSetEveryN: (n: number) => void;
  onSetMergeExtracted: (val: boolean) => void;
  onSetFilenamePrefix: (prefix: string) => void;
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
  onSetMode,
  onSetCustomRanges,
  onSetEveryN,
  onSetMergeExtracted,
  onSetFilenamePrefix,
  onExecuteSplit,
  onDownload,
  onResetSplit,
}) => {
  const rangeValidation = useMemo((): { valid: boolean; ranges: SplitRange[]; error?: string } => {
    if (options.mode !== 'range') return { valid: true, ranges: [] };
    return parseRangeString(options.customRanges, totalPages);
  }, [options.mode, options.customRanges, totalPages]);

  const outputSummary = useMemo(() => {
    switch (options.mode) {
      case 'extract': {
        const count = options.selectedPages.length;
        if (count === 0) return 'No pages selected yet. Click pages in the preview below to pick.';
        return options.mergeExtracted
          ? `Will produce 1 merged PDF containing ${count} selected page(s).`
          : `Will produce ${count} individual PDF files in a ZIP archive.`;
      }
      case 'range': {
        if (!rangeValidation.valid || rangeValidation.ranges.length === 0) {
          return 'Please enter valid page ranges.';
        }
        const rCount = rangeValidation.ranges.length;
        return rCount === 1
          ? `Will produce 1 PDF with pages ${rangeValidation.ranges[0].start} to ${rangeValidation.ranges[0].end}.`
          : `Will produce ${rCount} PDF files packaged in a ZIP archive.`;
      }
      case 'single': {
        return `Will extract all ${totalPages} pages into individual PDF files in a ZIP archive.`;
      }
      case 'every_n': {
        const parts = Math.ceil(totalPages / (options.everyN || 1));
        return `Will split the document into ${parts} separate PDF file(s) of up to ${options.everyN} page(s) each in a ZIP archive.`;
      }
    }
  }, [options, totalPages, rangeValidation]);

  const canExecute = useMemo(() => {
    if (isProcessing) return false;
    if (options.mode === 'extract') return options.selectedPages.length > 0;
    if (options.mode === 'range') return rangeValidation.valid && rangeValidation.ranges.length > 0;
    if (options.mode === 'every_n') return options.everyN >= 1;
    return true;
  }, [isProcessing, options, rangeValidation]);

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((progress.current / progress.total) * 100))
  );

  return (
    <Card className="flex flex-col gap-5 border border-border bg-bg-surface p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-main">
            Splitting Setup
          </h2>
          <p className="text-xs text-text-muted">
            Configure your splitting mode and parameters. Page previews are displayed below.
          </p>
        </div>

        {result && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetSplit}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Split Again
          </Button>
        )}
      </div>

      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onSetMode('extract')}
          disabled={isProcessing}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'extract'
              ? 'border-primary bg-sky-50/80 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <CheckSquare className="h-5 w-5 mb-1 text-primary" />
          <span className="text-xs font-semibold">Extract Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">Select in preview</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('range')}
          disabled={isProcessing}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'range'
              ? 'border-primary bg-sky-50/80 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <Scissors className="h-5 w-5 mb-1 text-primary" />
          <span className="text-xs font-semibold">By Range</span>
          <span className="text-[10px] text-text-muted mt-0.5">e.g. 1-3, 5-8</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('every_n')}
          disabled={isProcessing}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'every_n'
              ? 'border-primary bg-sky-50/80 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <Layers className="h-5 w-5 mb-1 text-primary" />
          <span className="text-xs font-semibold">Every N Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">Chunk equally</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('single')}
          disabled={isProcessing}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'single'
              ? 'border-primary bg-sky-50/80 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <FileArchive className="h-5 w-5 mb-1 text-primary" />
          <span className="text-xs font-semibold">All Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">1 page per file</span>
        </button>
      </div>

      {/* Mode Specific Inputs */}
      <div className="rounded border border-border bg-bg-subtle p-4 text-xs">
        {options.mode === 'extract' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-main">Extraction Output Format:</span>
              <span className="text-primary font-mono font-medium">
                {options.selectedPages.length} of {totalPages} pages selected
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-text-sub hover:text-text-main">
              <input
                type="radio"
                name="extractOutput"
                checked={options.mergeExtracted}
                onChange={() => onSetMergeExtracted(true)}
                disabled={isProcessing}
                className="h-4 w-4 text-primary accent-primary"
              />
              <span>Merge selected pages into a <strong>single continuous PDF</strong></span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-text-sub hover:text-text-main">
              <input
                type="radio"
                name="extractOutput"
                checked={!options.mergeExtracted}
                onChange={() => onSetMergeExtracted(false)}
                disabled={isProcessing}
                className="h-4 w-4 text-primary accent-primary"
              />
              <span>Download selected pages as <strong>individual separate PDFs (.ZIP archive)</strong></span>
            </label>
          </div>
        )}

        {options.mode === 'range' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="font-semibold text-text-main flex items-center gap-1.5" htmlFor="range-input">
                <Scissors className="h-3.5 w-3.5 text-primary" />
                <span>Python-Based Slicing & Visual Split Points:</span>
              </label>
              <span className="text-[11px] font-mono text-primary font-semibold">
                {options.splitPoints.length} Split Point(s) = {options.splitPoints.length + 1} PDF(s)
              </span>
            </div>

            <input
              id="range-input"
              type="text"
              value={options.customRanges}
              onChange={(e) => onSetCustomRanges(e.target.value)}
              disabled={isProcessing}
              placeholder="e.g. 1:5, 6:9, 10:50, 51:67"
              className={`w-full rounded border px-3 py-2 text-xs font-mono bg-bg-surface text-text-main outline-none focus:border-primary ${
                !rangeValidation.valid ? 'border-danger' : 'border-border'
              }`}
            />

            {!rangeValidation.valid ? (
              <p className="text-[11px] text-danger">{rangeValidation.error}</p>
            ) : (
              <p className="text-[11px] text-text-muted">
                Using Python-based indexing: <code className="bg-bg-surface px-1 py-0.5 rounded border border-border text-primary font-semibold">1:5</code> splits pages 1 to 5, <code className="bg-bg-surface px-1 py-0.5 rounded border border-border text-primary font-semibold">6:9</code> splits pages 6 to 9. Double-click any preview image below to toggle a blue split point.
              </p>
            )}

            {/* Split Points Indicators */}
            {options.splitPoints.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-text-sub">Active Split Points:</span>
                {options.splitPoints.map((pt, idx) => (
                  <span
                    key={pt}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-mono"
                  >
                    <Scissors className="h-2.5 w-2.5" />
                    Cut #{idx + 1}: after p.{pt}
                  </span>
                ))}
              </div>
            )}

            {/* Quick helper chips */}
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              <button
                type="button"
                onClick={() =>
                  onSetCustomRanges(
                    `1:${Math.ceil(totalPages / 2)}, ${Math.ceil(totalPages / 2) + 1}:${totalPages}`
                  )
                }
                disabled={isProcessing}
                className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px] font-mono"
              >
                Halves (1:{Math.ceil(totalPages / 2)}, {Math.ceil(totalPages / 2) + 1}:{totalPages})
              </button>

              {totalPages >= 4 && (
                <button
                  type="button"
                  onClick={() => {
                    const q1 = Math.ceil(totalPages / 4);
                    const q2 = Math.ceil(totalPages / 2);
                    const q3 = Math.ceil((totalPages * 3) / 4);
                    onSetCustomRanges(`1:${q1}, ${q1 + 1}:${q2}, ${q2 + 1}:${q3}, ${q3 + 1}:${totalPages}`);
                  }}
                  disabled={isProcessing}
                  className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px] font-mono"
                >
                  Quarters
                </button>
              )}

              <button
                type="button"
                onClick={() => onSetCustomRanges(`1:${totalPages}`)}
                disabled={isProcessing}
                className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px] font-mono"
              >
                Reset to Full (1:{totalPages})
              </button>
            </div>
          </div>
        )}

        {options.mode === 'every_n' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-text-main" htmlFor="every-n-input">
              Pages per Split Document:
            </label>
            <div className="flex items-center gap-3">
              <input
                id="every-n-input"
                type="number"
                min="1"
                max={totalPages}
                value={options.everyN}
                onChange={(e) => onSetEveryN(parseInt(e.target.value, 10) || 1)}
                disabled={isProcessing}
                className="w-24 rounded border border-border px-3 py-2 text-xs font-mono bg-bg-surface text-text-main outline-none focus:border-primary"
              />
              <span className="text-text-sub">
                Yields <strong>{Math.ceil(totalPages / (options.everyN || 1))}</strong> file(s) in a ZIP archive
              </span>
            </div>
          </div>
        )}

        {options.mode === 'single' && (
          <p className="text-text-sub">
            All <strong>{totalPages}</strong> pages will be cleanly decomposed into individual 1-page PDF documents packed inside a ZIP archive.
          </p>
        )}
      </div>

      {/* Output Filename Prefix */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-xs font-semibold text-text-main whitespace-nowrap" htmlFor="prefix-input">
          File Name Prefix:
        </label>
        <input
          id="prefix-input"
          type="text"
          value={options.filenamePrefix}
          onChange={(e) => onSetFilenamePrefix(e.target.value)}
          disabled={isProcessing}
          placeholder="split-document"
          className="flex-1 w-full rounded border border-border px-3 py-2 text-xs bg-bg-surface text-text-main outline-none focus:border-primary"
        />
      </div>

      {/* Summary Box */}
      <div className="rounded border border-border bg-bg-subtle p-3 text-xs text-text-sub">
        <span className="font-semibold text-text-main">Plan Summary: </span>
        {outputSummary}
      </div>

      {/* Execution, Loading & Download Section */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border">
        {/* If already completed, show prominent Download Button */}
        {result ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Split complete! Generated <strong>{result.fileCount}</strong> {result.isZip ? 'files in ZIP archive' : 'page(s) in PDF'}.
              </span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onDownload}
              leftIcon={<Download className="h-5 w-5" />}
              className="w-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600 font-semibold py-3 text-base shadow-sm"
            >
              Download {result.filename}
            </Button>
          </div>
        ) : (
          /* Split Button (Transforms into Loading Button during processing) */
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onExecuteSplit}
              disabled={!canExecute || isProcessing}
              className={`w-full font-semibold py-3 text-base transition-all ${
                isProcessing
                  ? 'bg-sky-600 border-sky-600 cursor-wait'
                  : 'bg-primary hover:bg-primary-hover border-primary shadow-sm'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Splitting PDF... ({progressPercent}%)</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  <span>Execute Split & Download</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {/* Real-time Progress Bar Just Below the Button */}
            {isProcessing && (
              <div className="w-full rounded border border-border bg-bg-surface p-3 transition-all animate-fadeIn">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-medium text-text-main flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    {progress.message || 'Processing pages...'}
                  </span>
                  <span className="font-mono font-bold text-primary">{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded bg-bg-subtle border border-border">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
