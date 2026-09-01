import React, { useState } from 'react';
import {
  MoreVertical,
  Scissors,
  ArrowLeft,
  ArrowRight,
  Move,
  FileDown,
} from 'lucide-react';

export interface CardActionsMenuProps {
  pageNumber: number;
  totalCount: number;
  isSplitPoint: boolean;
  disabled?: boolean;
  onToggleSplitPoint?: (page: number) => void;
  onMoveLeft?: (page: number) => void;
  onMoveRight?: (page: number) => void;
  onMoveToPosition?: (from: number, to: number) => void;
  onHoldPickup?: (page: number) => void;
  onExtractSinglePage?: (page: number) => void;
}

export const CardActionsMenu: React.FC<CardActionsMenuProps> = ({
  pageNumber,
  totalCount,
  isSplitPoint,
  disabled = false,
  onToggleSplitPoint,
  onMoveLeft,
  onMoveRight,
  onMoveToPosition,
  onHoldPickup,
  onExtractSinglePage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCustomMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    const target = prompt(`Move Page ${pageNumber} to position (1–${totalCount}):`, String(pageNumber));
    if (target) {
      const parsed = parseInt(target, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= totalCount && parsed !== pageNumber) {
        onMoveToPosition?.(pageNumber - 1, parsed - 1);
      }
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        title="Page actions & repositioning"
        className="p-1 rounded-md text-text-sub hover:text-text-main hover:bg-bg-subtle border border-transparent hover:border-border transition-colors"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 rounded-md border border-border bg-bg-surface py-1 shadow-lg z-50 text-xs">
            {onToggleSplitPoint && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onToggleSplitPoint(pageNumber);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle"
              >
                <Scissors className="h-3.5 w-3.5 text-primary" />
                <span>{isSplitPoint ? 'Remove Cut Point' : 'Cut / Split After This Page'}</span>
              </button>
            )}

            {onHoldPickup && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onHoldPickup(pageNumber);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle"
              >
                <Move className="h-3.5 w-3.5 text-amber-600" />
                <span>Pick up to Reposition</span>
              </button>
            )}

            {pageNumber > 1 && onMoveLeft && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onMoveLeft(pageNumber);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Move Left (Page {pageNumber - 1})</span>
              </button>
            )}

            {pageNumber < totalCount && onMoveRight && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onMoveRight(pageNumber);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span>Move Right (Page {pageNumber + 1})</span>
              </button>
            )}

            {totalCount > 1 && onMoveToPosition && (
              <button
                type="button"
                onClick={handleCustomMove}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle border-t border-border"
              >
                <Move className="h-3.5 w-3.5 text-text-sub" />
                <span>Move to Exact Position...</span>
              </button>
            )}

            {onExtractSinglePage && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onExtractSinglePage(pageNumber);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-text-main hover:bg-bg-subtle border-t border-border"
              >
                <FileDown className="h-3.5 w-3.5 text-text-sub" />
                <span>Extract Just This Page</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
