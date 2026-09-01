import React, { useMemo } from 'react';
import type { SplitOptions, SplitMode, SplitRange } from '../../types/pdf.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { parseRangeString } from '../../services/pdfSplitter';
import { Scissors, CheckSquare, Layers, FileArchive, ArrowRight } from 'lucide-react';

export interface SplitConfigPanelProps {
  options: SplitOptions;
  totalPages: number;
  isProcessing: boolean;
  onSetMode: (mode: SplitMode) => void;
  onSetCustomRanges: (ranges: string) => void;
  onSetEveryN: (n: number) => void;
  onSetMergeExtracted: (val: boolean) => void;
  onSetFilenamePrefix: (prefix: string) => void;
  onExecuteSplit: () => void;
}

export const SplitConfigPanel: React.FC<SplitConfigPanelProps> = ({
  options,
  totalPages,
  isProcessing,
  onSetMode,
  onSetCustomRanges,
  onSetEveryN,
  onSetMergeExtracted,
  onSetFilenamePrefix,
  onExecuteSplit,
}) => {
  const rangeValidation = useMemo((): { valid: boolean; ranges: SplitRange[]; error?: string } => {
    if (options.mode !== 'range') return { valid: true, ranges: [] };
    return parseRangeString(options.customRanges, totalPages);
  }, [options.mode, options.customRanges, totalPages]);

  const outputSummary = useMemo(() => {
    switch (options.mode) {
      case 'extract': {
        const count = options.selectedPages.length;
        if (count === 0) return 'No pages selected.';
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

  return (
    <Card className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold text-text-main mb-1">Split Configuration</h3>
        <p className="text-xs text-text-muted">Choose your splitting method and customize output parameters.</p>
      </div>

      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onSetMode('extract')}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'extract'
              ? 'border-primary bg-sky-50/70 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <CheckSquare className="h-5 w-5 mb-1.5" />
          <span className="text-xs font-semibold">Extract Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">Pick visually</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('range')}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'range'
              ? 'border-primary bg-sky-50/70 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <Scissors className="h-5 w-5 mb-1.5" />
          <span className="text-xs font-semibold">By Range</span>
          <span className="text-[10px] text-text-muted mt-0.5">e.g. 1-3, 5-8</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('every_n')}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'every_n'
              ? 'border-primary bg-sky-50/70 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <Layers className="h-5 w-5 mb-1.5" />
          <span className="text-xs font-semibold">Every N Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">Chunk equally</span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode('single')}
          className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all ${
            options.mode === 'single'
              ? 'border-primary bg-sky-50/70 text-primary font-medium ring-1 ring-primary'
              : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-sub'
          }`}
        >
          <FileArchive className="h-5 w-5 mb-1.5" />
          <span className="text-xs font-semibold">All Pages</span>
          <span className="text-[10px] text-text-muted mt-0.5">1 page per file</span>
        </button>
      </div>

      {/* Mode Specific Inputs */}
      <div className="flex flex-col gap-4 rounded border border-border bg-bg-subtle p-4 text-xs">
        {options.mode === 'extract' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-main">Extraction Output Mode:</span>
              <span className="text-text-muted font-mono">{options.selectedPages.length} pages selected</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-text-sub hover:text-text-main">
              <input
                type="radio"
                name="extractOutput"
                checked={options.mergeExtracted}
                onChange={() => onSetMergeExtracted(true)}
                className="h-4 w-4 text-primary accent-primary"
              />
              <span>Merge all extracted pages into a <strong>single PDF document</strong></span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-text-sub hover:text-text-main">
              <input
                type="radio"
                name="extractOutput"
                checked={!options.mergeExtracted}
                onChange={() => onSetMergeExtracted(false)}
                className="h-4 w-4 text-primary accent-primary"
              />
              <span>Save each extracted page as an <strong>individual file (.ZIP archive)</strong></span>
            </label>
          </div>
        )}

        {options.mode === 'range' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-text-main" htmlFor="range-input">
              Specify Page Ranges:
            </label>
            <input
              id="range-input"
              type="text"
              value={options.customRanges}
              onChange={(e) => onSetCustomRanges(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-9"
              className={`w-full rounded border px-3 py-2 text-xs font-mono bg-bg-surface text-text-main outline-none focus:border-primary ${
                !rangeValidation.valid ? 'border-danger' : 'border-border'
              }`}
            />
            {!rangeValidation.valid ? (
              <p className="text-[11px] text-danger">{rangeValidation.error}</p>
            ) : (
              <p className="text-[11px] text-text-muted">
                Separate page numbers and ranges by commas. Document has {totalPages} total pages.
              </p>
            )}

            {/* Helper quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => onSetCustomRanges(`1-${Math.ceil(totalPages / 2)}`)}
                className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px]"
              >
                First Half (1-{Math.ceil(totalPages / 2)})
              </button>
              {totalPages > 1 && (
                <button
                  type="button"
                  onClick={() => onSetCustomRanges(`${Math.ceil(totalPages / 2) + 1}-${totalPages}`)}
                  className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:bg-border text-text-sub text-[11px]"
                >
                  Second Half ({Math.ceil(totalPages / 2) + 1}-{totalPages})
                </button>
              )}
            </div>
          </div>
        )}

        {options.mode === 'every_n' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-text-main" htmlFor="every-n-input">
              Split Interval (Pages per PDF):
            </label>
            <div className="flex items-center gap-3">
              <input
                id="every-n-input"
                type="number"
                min="1"
                max={totalPages}
                value={options.everyN}
                onChange={(e) => onSetEveryN(parseInt(e.target.value, 10) || 1)}
                className="w-24 rounded border border-border px-3 py-2 text-xs font-mono bg-bg-surface text-text-main outline-none focus:border-primary"
              />
              <span className="text-text-sub">
                Yields <strong>{Math.ceil(totalPages / (options.everyN || 1))}</strong> file(s)
              </span>
            </div>
          </div>
        )}

        {options.mode === 'single' && (
          <p className="text-text-sub">
            Each of the <strong>{totalPages}</strong> pages will be saved as an independent single-page PDF document.
          </p>
        )}
      </div>

      {/* Output Filename Prefix */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-main" htmlFor="prefix-input">
          File Name Prefix:
        </label>
        <input
          id="prefix-input"
          type="text"
          value={options.filenamePrefix}
          onChange={(e) => onSetFilenamePrefix(e.target.value)}
          placeholder="split-document"
          className="w-full rounded border border-border px-3 py-2 text-xs bg-bg-surface text-text-main outline-none focus:border-primary"
        />
      </div>

      {/* Execution Summary & Trigger */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border">
        <div className="rounded border border-border bg-bg-subtle p-3 text-xs text-text-sub">
          <span className="font-semibold text-text-main">Summary: </span>
          {outputSummary}
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onExecuteSplit}
          disabled={!canExecute}
          isLoading={isProcessing}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="w-full"
        >
          {isProcessing ? 'Processing PDF...' : 'Execute Split & Download'}
        </Button>
      </div>
    </Card>
  );
};
