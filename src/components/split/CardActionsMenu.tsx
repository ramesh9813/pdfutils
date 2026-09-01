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
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs sm:bg-transparent sm:backdrop-blur-none sm:z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-1 sm:w-52 rounded-t-2xl sm:rounded-md border-t sm:border border-border bg-bg-surface p-3 sm:py-1 sm:px-0 shadow-2xl sm:shadow-lg text-xs animate-in slide-in-from-bottom sm:animate-none">
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border sm:hidden">
              <span className="font-bold text-sm text-text-main">Page {pageNumber} Actions</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-text-sub font-semibold hover:text-primary px-2 py-0.5"
              >
                Close
              </button>
            </div>

            {onToggleSplitPoint && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onToggleSplitPoint(pageNumber);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle rounded-md sm:rounded-none"
              >
                <Scissors className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-primary" />
                <span>{isSplitPoint ? 'Remove Cut' : 'Cut After Page'}</span>
              </button>
            )}

            {onHoldPickup && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onHoldPickup(pageNumber);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle rounded-md sm:rounded-none"
              >
                <Move className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-primary" />
                <span>Pick Up Page</span>
              </button>
            )}

            {pageNumber > 1 && onMoveLeft && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onMoveLeft(pageNumber);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle rounded-md sm:rounded-none"
              >
                <ArrowLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span>Move Left</span>
              </button>
            )}

            {pageNumber < totalCount && onMoveRight && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onMoveRight(pageNumber);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle rounded-md sm:rounded-none"
              >
                <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span>Move Right</span>
              </button>
            )}

            {totalCount > 1 && onMoveToPosition && (
              <button
                type="button"
                onClick={handleCustomMove}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle border-t border-border rounded-md sm:rounded-none"
              >
                <Move className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-text-sub" />
                <span>Move to Position...</span>
              </button>
            )}

            {onExtractSinglePage && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onExtractSinglePage(pageNumber);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 sm:py-1.5 text-left text-sm sm:text-xs text-text-main hover:bg-bg-subtle border-t border-border rounded-md sm:rounded-none"
              >
                <FileDown className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-text-sub" />
                <span>Extract Page</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
