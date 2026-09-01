import React from 'react';
import type { SplitMode } from '../../types/pdf.types';
import { Button } from '../common/Button';
import {
  CheckSquare,
  Square,
  RotateCcw,
  Scissors,
  GripVertical,
} from 'lucide-react';

export interface PagePreviewToolbarProps {
  splitMode: SplitMode;
  totalPages: number;
  selectedCount: number;
  splitPointCount: number;
  isOrderChanged: boolean;
  gridSize: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onSelectAll: (total: number) => void;
  onDeselectAll: () => void;
  onClearSplitPoints: () => void;
  onResetPageOrder?: () => void;
  onGridSizeChange: (size: 'sm' | 'md' | 'lg') => void;
}

export const PagePreviewToolbar: React.FC<PagePreviewToolbarProps> = ({
  splitMode,
  totalPages,
  selectedCount,
  splitPointCount,
  isOrderChanged,
  gridSize,
  disabled = false,
  onSelectAll,
  onDeselectAll,
  onClearSplitPoints,
  onResetPageOrder,
  onGridSizeChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        {splitMode === 'extract' ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onSelectAll(totalPages)}
              disabled={disabled || selectedCount === totalPages}
              leftIcon={<CheckSquare className="h-3.5 w-3.5" />}
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              disabled={disabled || selectedCount === 0}
              leftIcon={<Square className="h-3.5 w-3.5" />}
            >
              Clear
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted flex items-center gap-1">
              <Scissors className="h-3.5 w-3.5 text-primary" />
              Double-click to cut
            </span>
            {splitPointCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearSplitPoints}
                disabled={disabled}
                leftIcon={<RotateCcw className="h-3 w-3" />}
              >
                Clear Cuts ({splitPointCount})
              </Button>
            )}
          </div>
        )}

        {isOrderChanged && onResetPageOrder && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetPageOrder}
            disabled={disabled}
            leftIcon={<GripVertical className="h-3 w-3 text-primary" />}
          >
            Reset Order
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-text-muted">Size:</span>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onGridSizeChange(size)}
            className={`px-2 py-0.5 rounded border text-xs font-semibold uppercase ${
              gridSize === size
                ? 'bg-primary text-white border-primary'
                : 'border-border bg-bg-surface text-text-sub hover:bg-bg-subtle'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
