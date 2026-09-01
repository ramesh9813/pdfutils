import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Dropzone } from './Dropzone';
import {
  FileText,
  CheckCircle2,
  Minimize2,
  Scissors,
  Layers,
  ArrowUpDown,
  RefreshCw,
  X,
} from 'lucide-react';

export interface QuickStartUploadCardProps {
  sharedFile: File | null;
  onUpload: (files: File[]) => void;
  onClear: () => void;
  onNavigate: (path: string) => void;
}

export const QuickStartUploadCard: React.FC<QuickStartUploadCardProps> = ({
  sharedFile,
  onUpload,
  onClear,
  onNavigate,
}) => {
  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6 bg-gradient-to-br from-sky-50/70 via-bg-surface to-bg-surface border-2 border-sky-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-main">
              Quick Start Upload
            </h2>
            <p className="text-xs text-text-muted">
              Drop PDF to process across any tool.
            </p>
          </div>
        </div>
        {sharedFile && (
          <Button type="button" variant="outline" size="sm" onClick={onClear} leftIcon={<X className="h-3.5 w-3.5" />}>
            Clear
          </Button>
        )}
      </div>

      {!sharedFile ? (
        <Dropzone
          multiple={false}
          title="Drop PDF to begin"
          subtitle="Auto-loads into Reduce, Split, Merge, or Reorder."
          onFilesSelected={onUpload}
          className="py-5 bg-white/60"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-white border border-sky-300 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-main truncate max-w-sm">
                {sharedFile.name}
              </span>
              <span className="text-[11px] text-text-muted">
                Ready • {(sharedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/reduce')}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-primary text-white hover:bg-primary-hover transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              Reduce Size
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/split')}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-bg-surface hover:bg-bg-subtle text-text-main transition-colors flex items-center gap-1.5"
            >
              <Scissors className="h-3.5 w-3.5 text-primary" />
              Split
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/merge')}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-bg-surface hover:bg-bg-subtle text-text-main transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-primary" />
              Merge
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/convert')}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-bg-surface hover:bg-bg-subtle text-text-main transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5 text-rose-500" />
              Convert
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/reorder')}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-bg-surface hover:bg-bg-subtle text-text-main transition-colors flex items-center gap-1.5"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              Reorder
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
