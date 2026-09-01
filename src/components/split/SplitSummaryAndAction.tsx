import React from 'react';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import type { ProgressState, SplitOutput } from '../../types/pdf.types';
import { Scissors, Download, Loader2, CheckCircle2 } from 'lucide-react';

export interface SplitSummaryAndActionProps {
  summaryText: string;
  filenamePrefix: string;
  canExecute: boolean;
  isProcessing: boolean;
  progress: ProgressState;
  result: SplitOutput | null;
  onSetFilenamePrefix: (prefix: string) => void;
  onExecuteSplit: () => void;
  onDownload: () => void;
}

export const SplitSummaryAndAction: React.FC<SplitSummaryAndActionProps> = ({
  summaryText,
  filenamePrefix,
  canExecute,
  isProcessing,
  progress,
  result,
  onSetFilenamePrefix,
  onExecuteSplit,
  onDownload,
}) => {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-text-sub block mb-0.5">
            Plan:
          </span>
          <p className="text-xs text-text-main font-medium">{summaryText}</p>
        </div>

        <div className="w-full sm:w-52">
          <label className="text-[11px] font-semibold text-text-muted mb-0.5 block" htmlFor="prefix-input">
            File Prefix:
          </label>
          <input
            id="prefix-input"
            type="text"
            value={filenamePrefix}
            onChange={(e) => onSetFilenamePrefix(e.target.value)}
            disabled={isProcessing}
            placeholder="document"
            className="w-full rounded border border-border px-2.5 py-1 text-xs bg-bg-surface text-text-main outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      {progress.status !== 'idle' && <ProgressBar progress={progress} />}

      {result && (
        <div className="flex items-center justify-between gap-3 p-3 rounded bg-emerald-50 border border-emerald-300">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Done! ({result.fileCount} parts)</span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onDownload}
            leftIcon={<Download className="h-3.5 w-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Download ({result.isZip ? 'ZIP' : 'PDF'})
          </Button>
        </div>
      )}

      {!result && (
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onExecuteSplit}
          disabled={!canExecute || isProcessing}
          leftIcon={
            isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Scissors className="h-4 w-4" />
            )
          }
          className="w-full py-2.5 text-xs font-bold"
        >
          {isProcessing
            ? `Splitting... (${progress.current}/${progress.total})`
            : 'Split PDF'}
        </Button>
      )}
    </div>
  );
};
