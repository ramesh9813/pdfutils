import React from 'react';
import { Button } from '../../components/common/Button';
import { RotateCcw, ArrowUpDown, Download, Loader2 } from 'lucide-react';

export interface ReorderToolbarProps {
  pageCount: number;
  isModified: boolean;
  isProcessing: boolean;
  onReverse: () => void;
  onReset: () => void;
  onSave: () => void;
}

export const ReorderToolbar: React.FC<ReorderToolbarProps> = ({
  pageCount,
  isModified,
  isProcessing,
  onReverse,
  onReset,
  onSave,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3.5 shadow-xs">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReverse}
          disabled={isProcessing || pageCount < 2}
          leftIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
        >
          Reverse
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isProcessing || !isModified}
          leftIcon={<RotateCcw className="h-3.5 w-3.5 text-amber-600" />}
        >
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted">
          {pageCount} Pages {isModified ? '(Modified)' : ''}
        </span>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isProcessing}
          leftIcon={
            isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )
          }
        >
          {isProcessing ? 'Saving...' : 'Download PDF'}
        </Button>
      </div>
    </div>
  );
};
