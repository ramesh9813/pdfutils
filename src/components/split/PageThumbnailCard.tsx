import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  Maximize2,
  Check,
  Loader2,
  MoreVertical,
  Scissors,
  FileCheck,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Move,
  X,
} from 'lucide-react';
import type { PdfPageDetail, SplitMode } from '../../types/pdf.types';

export interface PageThumbnailCardProps {
  page: PdfPageDetail;
  index: number;
  totalPages: number;
  isSelected: boolean;
  isSplitPoint: boolean;
  splitPointIndex?: number;
  splitMode: SplitMode;
  onToggleSelect: (pageNumber: number) => void;
  onToggleSplitPoint: (pageNumber: number) => void;
  onRotate: (pageNumber: number) => void;
  onPreview: (page: PdfPageDetail) => void;
  onSplitFromHere?: (pageNumber: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
  // Reordering props
  isHeld?: boolean;
  hasAnyHeld?: boolean;
  onHoldStart?: (pageIndex: number) => void;
  onHoldCancel?: () => void;
  onDropOnPage?: (targetIndex: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
}

export const PageThumbnailCard: React.FC<PageThumbnailCardProps> = ({
  page,
  index,
  totalPages,
  isSelected,
  isSplitPoint,
  splitPointIndex = 0,
  splitMode,
  onToggleSelect,
  onToggleSplitPoint,
  onRotate,
  onPreview,
  onSplitFromHere,
  onExtractSinglePage,
  isHeld = false,
  hasAnyHeld = false,
  onHoldStart,
  onHoldCancel,
  onDropOnPage,
  onMovePage,
  disabled = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoldingDown, setIsHoldingDown] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const didTriggerHoldRef = useRef(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Cancel hold helper
  const cancelHoldTimer = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHoldingDown(false);
    setHoldProgress(0);
  }, []);

  // Start hold detection (mouse or touch)
  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isHeld || hasAnyHeld) return;
    if ('button' in e && e.button !== 0) return; // only left click

    didTriggerHoldRef.current = false;
    holdStartTimeRef.current = Date.now();
    setIsHoldingDown(true);
    setHoldProgress(0);

    const holdDuration = 1200; // ~1.2 seconds hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / holdDuration) * 100));
      setHoldProgress(progress);

      if (elapsed >= holdDuration) {
        cancelHoldTimer();
        didTriggerHoldRef.current = true;
        onHoldStart?.(index);
      }
    }, 40);
  };

  const handleHoldEnd = () => {
    cancelHoldTimer();
  };

  // Thumbnail click handler: differentiates single click (full preview) vs double click (split point)
  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If hold was triggered, don't execute click
    if (didTriggerHoldRef.current) {
      didTriggerHoldRef.current = false;
      return;
    }

    // If another card is currently held, clicking this card acts as the drop target!
    if (hasAnyHeld && !isHeld) {
      onDropOnPage?.(index);
      return;
    }

    if (isHeld) {
      onHoldCancel?.();
      return;
    }

    // Distinguish single click vs double click
    if (clickTimerRef.current) {
      // Second click arrived within ~260ms -> DOUBLE CLICK!
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onToggleSplitPoint(page.pageNumber);
    } else {
      // First click: schedule single click modal preview after 260ms
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        onPreview(page);
      }, 260);
    }
  };

  // Manual move prompt
  const handlePromptMove = () => {
    setIsMenuOpen(false);
    const target = window.prompt(
      `Move Page ${page.pageNumber} to position (1 to ${totalPages}):`,
      String(page.pageNumber)
    );
    if (!target) return;
    const targetPage = parseInt(target.trim(), 10);
    if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages) {
      alert(`Please enter a valid page number between 1 and ${totalPages}.`);
      return;
    }
    onMovePage?.(index, targetPage - 1);
  };

  return (
    <div
      draggable={!disabled && !isMenuOpen}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(index));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const sourceIndexStr = e.dataTransfer.getData('text/plain');
        const sourceIdx = parseInt(sourceIndexStr, 10);
        if (!isNaN(sourceIdx) && sourceIdx !== index) {
          onMovePage?.(sourceIdx, index);
        }
      }}
      className={`group relative flex flex-col rounded border bg-bg-surface transition-all select-none ${
        isHeld
          ? 'border-amber-500 ring-4 ring-amber-400/50 shadow-2xl scale-[1.03] z-30'
          : hasAnyHeld
          ? 'border-dashed border-sky-400 hover:border-sky-600 hover:bg-sky-50/40 cursor-pointer'
          : isSplitPoint
          ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
          : isSelected && splitMode === 'extract'
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : 'border-border hover:border-text-muted hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-bg-subtle/70 px-2.5 py-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Checkbox for extract mode */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              !disabled && onToggleSelect(page.pageNumber);
            }}
            title={isSelected ? 'Deselect page' : 'Select page for extraction'}
            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
              isSelected
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-bg-surface hover:border-primary'
            }`}
          >
            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
          </button>

          <span className="font-bold text-text-main">
            p.{page.pageNumber}
          </span>
          {page.originalPageIndex !== page.pageNumber - 1 && (
            <span
              className="text-[10px] text-amber-700 bg-amber-100 font-mono px-1 rounded"
              title={`Original page #${page.originalPageIndex + 1}`}
            >
              orig #{page.originalPageIndex + 1}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100">
          <button
            type="button"
            title="Rotate 90° Clockwise"
            onClick={(e) => {
              e.stopPropagation();
              onRotate(page.pageNumber);
            }}
            disabled={disabled}
            className="p-1 rounded hover:bg-border text-text-sub hover:text-text-main transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            title="View Full Page"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(page);
            }}
            className="p-1 rounded hover:bg-border text-text-sub hover:text-text-main transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {/* Three dots menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              title="Page Options & Restructure"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="p-1 rounded hover:bg-border text-text-sub hover:text-text-main transition-colors"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {/* Dropdown Card */}
            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 w-60 rounded border border-border bg-bg-surface p-1.5 shadow-xl z-50 text-xs flex flex-col gap-1"
              >
                <div className="px-2 py-1 border-b border-border text-[11px] font-semibold text-text-muted flex items-center justify-between">
                  <span>Page {page.pageNumber} Options</span>
                  <span className="font-mono text-[10px]">Pos {index + 1}/{totalPages}</span>
                </div>

                {/* Restructure & Move Page Section */}
                <div className="flex flex-col gap-0.5 border-b border-border pb-1">
                  <span className="px-2 pt-1 text-[10px] uppercase font-bold text-text-muted tracking-wider">
                    Restructure Position
                  </span>
                  
                  <div className="grid grid-cols-2 gap-1 px-1 py-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onMovePage?.(index, index - 1);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] border border-border hover:bg-bg-subtle disabled:opacity-40"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Move Left</span>
                    </button>

                    <button
                      type="button"
                      disabled={index === totalPages - 1}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onMovePage?.(index, index + 1);
                      }}
                      className="flex items-center justify-end gap-1 px-2 py-1 rounded text-[11px] border border-border hover:bg-bg-subtle disabled:opacity-40"
                    >
                      <span>Move Right</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePromptMove}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                  >
                    <Move className="h-3.5 w-3.5 text-text-sub shrink-0" />
                    <span>Move to exact position...</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onHoldStart?.(index);
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <GripVertical className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Pick up to reposition (Hold)</span>
                  </button>
                </div>

                {/* Splitting point action */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleSplitPoint(page.pageNumber);
                  }}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                >
                  <Scissors className={`h-4 w-4 ${isSplitPoint ? 'text-danger' : 'text-primary'} shrink-0`} />
                  <span>
                    {isSplitPoint ? `Remove Split Point at p.${page.pageNumber}` : `Set Split Point after p.${page.pageNumber}`}
                  </span>
                </button>

                {onSplitFromHere && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSplitFromHere(page.pageNumber);
                    }}
                    className="flex items-start gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                  >
                    <Scissors className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-text-main">Split from here</div>
                      <div className="text-[10px] text-text-muted">
                        Part 1 (p.1–{page.pageNumber}) & Part 2 (p.{Math.min(page.pageNumber + 1, totalPages)}–{totalPages})
                      </div>
                    </div>
                  </button>
                )}

                {onExtractSinglePage && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onExtractSinglePage(page.pageNumber);
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                  >
                    <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Extract only page {page.pageNumber}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRotate(page.pageNumber);
                  }}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                >
                  <RotateCw className="h-4 w-4 text-text-sub shrink-0" />
                  <span>Rotate 90° Clockwise</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Area with Hold & Click listeners */}
      <div
        onClick={handleThumbnailClick}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        title={
          isHeld
            ? 'Holding page! Click any page to place it there.'
            : hasAnyHeld
            ? 'Click to place held page here'
            : 'Single click: Full preview • Double click: Toggle split point • Hold ~1s: Restructure page'
        }
        className="relative flex items-center justify-center p-3 bg-bg-subtle/30 min-h-[160px] aspect-[3/4] cursor-pointer"
      >
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${page.pageNumber}`}
            className="max-h-full max-w-full object-contain rounded border border-border shadow-xs pointer-events-none"
            loading="lazy"
          />
        ) : page.isLoadingThumbnail ? (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-[11px]">Rendering...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-text-muted">
            <span className="text-xs">Preview unavailable</span>
          </div>
        )}

        {/* Selected Overlay for Extract mode */}
        {isSelected && splitMode === 'extract' && !isSplitPoint && (
          <div className="absolute inset-0 bg-sky-500/10 pointer-events-none" />
        )}

        {/* Hold Progress Bar Overlay */}
        {isHoldingDown && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[0.5px] flex flex-col items-center justify-center p-4 pointer-events-none z-20">
            <span className="text-xs font-bold text-white mb-2">Holding to reorder...</span>
            <div className="h-2 w-full max-w-[120px] rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Held State Badge */}
        {isHeld && (
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[0.5px] flex flex-col items-center justify-between p-2 pointer-events-none z-20 animate-fadeIn">
            <div className="w-full flex justify-end pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onHoldCancel?.();
                }}
                title="Cancel reordering"
                className="bg-slate-900/80 text-white rounded p-1 hover:bg-slate-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="bg-amber-600 text-white font-bold text-xs px-2.5 py-1.5 rounded shadow-lg flex items-center gap-1.5 border border-amber-300">
              <GripVertical className="h-4 w-4" />
              <span>Attached to Hold</span>
            </div>
            <div className="text-[11px] font-medium text-slate-900 bg-amber-300/90 rounded px-2 py-0.5 shadow-xs">
              Click any page to place here
            </div>
          </div>
        )}

        {/* Target Hover Prompt when another card is held */}
        {hasAnyHeld && !isHeld && (
          <div className="absolute inset-0 bg-sky-500/10 hover:bg-sky-500/25 border-2 border-dashed border-sky-400 flex items-center justify-center pointer-events-none transition-colors">
            <span className="bg-sky-600 text-white text-[11px] font-bold px-2 py-1 rounded shadow">
              Click to place here
            </span>
          </div>
        )}

        {/* BLUE OVERLAY WHEN SPLIT POINT IS APPLIED */}
        {isSplitPoint && (
          <div className="absolute inset-0 bg-blue-600/35 backdrop-blur-[0.5px] flex flex-col items-center justify-between p-2 pointer-events-none z-10 transition-all animate-fadeIn">
            <div className="w-full flex justify-end">
              <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-blue-400">
                <Scissors className="h-3 w-3" />
                SPLIT POINT #{splitPointIndex + 1}
              </span>
            </div>

            <div className="bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md border border-blue-300/40 flex items-center gap-1.5">
              <Scissors className="h-3.5 w-3.5" />
              Cut After Page {page.pageNumber}
            </div>

            <div className="w-full text-center text-[10px] text-white font-semibold bg-blue-900/80 rounded px-1.5 py-0.5">
              Part {splitPointIndex + 1} ends here
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Instructions Hint */}
      <div className="flex items-center justify-between border-t border-border bg-bg-surface px-2.5 py-1 text-[11px] text-text-muted">
        <span title="Orientation">{page.rotation !== 0 ? `${page.rotation}°` : '0°'}</span>
        <span className="font-mono">{Math.round(page.width)}×{Math.round(page.height)} pt</span>
      </div>

      {/* Right Edge Split Divider Indicator */}
      {isSplitPoint && (
        <div
          title={`Split boundary after page ${page.pageNumber}`}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center"
        >
          <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Scissors className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};

