import React from 'react';
import { ProgressState } from '../../types/pdf.types';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ProgressBarProps {
  progress: ProgressState;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  if (progress.status === 'idle') return null;

  const percentage = Math.min(100, Math.max(0, Math.round((progress.current / progress.total) * 100)));
  const isError = progress.status === 'error';
  const isComplete = progress.status === 'completed';

  return (
    <div className={`w-full rounded border border-border bg-bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-danger" />
          ) : isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
          <span className={isError ? 'text-danger' : 'text-text-main'}>
            {progress.message || (isComplete ? 'Processing Complete' : 'Processing...')}
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-text-sub">
          {isError ? 'Failed' : `${percentage}%`}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded bg-bg-subtle border border-border">
        <div
          className={`h-full transition-all duration-200 ${
            isError ? 'bg-danger' : isComplete ? 'bg-emerald-600' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isError && progress.error && (
        <p className="mt-2 text-xs text-danger">{progress.error}</p>
      )}
    </div>
  );
};
