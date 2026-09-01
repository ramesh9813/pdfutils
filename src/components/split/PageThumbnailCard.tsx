import React, { useState, useRef } from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { CardActionsMenu } from './CardActionsMenu';
import { CardOverlayIndicators } from './CardOverlayIndicators';
import { CardFooterBar } from './CardFooterBar';
import { RotateCw, FileText } from 'lucide-react';

export interface PageThumbnailCardProps {
  page: PdfPageDetail;
  totalCount: number;
  isSelected?: boolean;
  isSplitPoint?: boolean;
  splitIndex?: number;
  isHeld?: boolean;
  disabled?: boolean;
  sourceBuffer?: ArrayBuffer | null;
  baseDocName?: string;
  onToggleSelect?: (pageNumber: number) => void;
  onToggleSplitPoint?: (pageNumber: number) => void;
  onRotate?: (pageNumber: number) => void;
  onPreviewFull?: (page: PdfPageDetail) => void;
  onHoldStart?: (pageNumber: number) => void;
  onDropOnPage?: (targetPageNumber: number) => void;
  onMoveLeft?: (pageNumber: number) => void;
  onMoveRight?: (pageNumber: number) => void;
  onMoveToPosition?: (fromIndex: number, toIndex: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
}

export const PageThumbnailCard: React.FC<PageThumbnailCardProps> = ({
  page,
  totalCount,
  isSelected = false,
  isSplitPoint = false,
  splitIndex = -1,
  isHeld = false,
  disabled = false,
  sourceBuffer,
  baseDocName,
  onToggleSelect,
  onToggleSplitPoint,
  onRotate,
  onPreviewFull,
  onHoldStart,
  onDropOnPage,
  onMoveLeft,
  onMoveRight,
  onMoveToPosition,
  onExtractSinglePage,
}) => {
  const [holdProgress, setHoldProgress] = useState(0);

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const didTriggerHoldRef = useRef(false);

  const clearHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = null;
    setHoldProgress(0);
  };

  const handlePointerDown = () => {
    if (disabled || isHeld) return;
    didTriggerHoldRef.current = false;
    holdStartTimeRef.current = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / 1200) * 100));
      setHoldProgress(pct);
      if (elapsed >= 1200) {
        clearHold();
        didTriggerHoldRef.current = true;
        onHoldStart?.(page.pageNumber);
      }
    }, 50);
  };

  const handleClick = () => {
    if (didTriggerHoldRef.current) {
      didTriggerHoldRef.current = false;
      return;
    }
    if (onDropOnPage && !isHeld) {
      onDropOnPage(page.pageNumber);
      return;
    }
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onToggleSplitPoint?.(page.pageNumber);
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      if (onToggleSelect) {
        onToggleSelect(page.pageNumber);
      } else {
        onPreviewFull?.(page);
      }
    }, 260);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRotate?.(page.pageNumber);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={clearHold}
      onPointerLeave={clearHold}
      onClick={handleClick}
      className={`group relative flex flex-col rounded-lg border bg-bg-surface overflow-hidden shadow-xs select-none cursor-pointer transition-all duration-150 ${
        isSplitPoint
          ? 'border-blue-600 ring-2 ring-blue-500 shadow-md'
          : isSelected
          ? 'border-primary ring-2 ring-primary/40'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-bg-subtle/80 border-b border-border text-xs z-10">
        <span className="font-bold font-mono text-text-main">
          p.{page.pageNumber}
          {page.originalPageIndex !== page.pageNumber - 1 && (
            <span className="text-[10px] text-amber-600 font-semibold ml-1">
              (orig. {page.originalPageIndex + 1})
            </span>
          )}
        </span>

        {/* Top-Right: Rotate 90° tab/button & 3-dot menu */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate 90° Clockwise"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white hover:bg-sky-50 text-text-sub hover:text-primary border border-border transition-colors shadow-2xs"
          >
            <RotateCw className="h-2.5 w-2.5" />
            <span>Rotate 90°</span>
          </button>

          <CardActionsMenu
            pageNumber={page.pageNumber}
            totalCount={totalCount}
            isSplitPoint={isSplitPoint}
            disabled={disabled}
            onToggleSplitPoint={onToggleSplitPoint}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            onMoveToPosition={onMoveToPosition}
            onHoldPickup={onHoldStart}
            onExtractSinglePage={onExtractSinglePage}
          />
        </div>
      </div>

      {/* Thumbnail Area */}
      <div className="relative aspect-[3/4] w-full bg-slate-100/50 flex items-center justify-center overflow-hidden">
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${page.pageNumber}`}
            className="h-full w-full object-contain pointer-events-none transition-transform"
            style={{ transform: `rotate(${page.rotation}deg)` }}
          />
        ) : (
          <FileText className="h-10 w-10 text-text-muted/40 animate-pulse" />
        )}

        <CardOverlayIndicators
          isSplitPoint={isSplitPoint}
          splitIndex={splitIndex}
          pageNumber={page.pageNumber}
          isHeld={isHeld}
          holdProgress={holdProgress}
        />
      </div>

      {/* Bottom Bar: Download button */}
      <CardFooterBar
        page={page}
        sourceBuffer={sourceBuffer}
        baseDocName={baseDocName}
        onPreviewFull={onPreviewFull}
      />
    </div>
  );
};
