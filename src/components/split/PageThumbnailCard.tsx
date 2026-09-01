import React, { useState, useRef } from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { CardHeaderBar } from './CardHeaderBar';
import { CardOverlayIndicators } from './CardOverlayIndicators';
import { CardFooterBar } from './CardFooterBar';
import { FileText } from 'lucide-react';

export interface PageThumbnailCardProps {
  page: PdfPageDetail;
  totalCount: number;
  isSelected?: boolean;
  isSplitPoint?: boolean;
  splitIndex?: number;
  isHeld?: boolean;
  isDropTarget?: boolean;
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
  isDropTarget = false,
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
  const lastClickTimeRef = useRef<number>(0);
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
      const pct = Math.min(100, Math.round((elapsed / 1000) * 100));
      setHoldProgress(pct);
      if (elapsed >= 1000) {
        clearHold();
        didTriggerHoldRef.current = true;
        onHoldStart?.(page.pageNumber);
      }
    }, 50);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    lastClickTimeRef.current = 0;
    onToggleSplitPoint?.(page.pageNumber);
  };

  const handleClick = () => {
    if (didTriggerHoldRef.current) {
      didTriggerHoldRef.current = false;
      return;
    }
    if (isDropTarget && onDropOnPage) {
      onDropOnPage(page.pageNumber);
      return;
    }

    const now = Date.now();
    if (now - lastClickTimeRef.current < 450) {
      lastClickTimeRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      onToggleSplitPoint?.(page.pageNumber);
      return;
    }
    lastClickTimeRef.current = now;

    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      if (onToggleSelect) {
        onToggleSelect(page.pageNumber);
      } else {
        onPreviewFull?.(page);
      }
    }, 320);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={clearHold}
      onPointerLeave={clearHold}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group relative flex flex-col rounded-lg border shadow-xs select-none cursor-pointer transition-all duration-150 ${
        isHeld
          ? 'border-amber-500 ring-2 ring-amber-500 shadow-md opacity-90 bg-bg-surface'
          : isDropTarget
          ? 'border-amber-400 ring-2 ring-amber-300 ring-dashed hover:ring-amber-500 bg-amber-50/20'
          : isSplitPoint
          ? 'border-blue-600 ring-4 ring-blue-500/60 shadow-lg bg-blue-50/80'
          : isSelected
          ? 'border-primary ring-2 ring-primary/40 bg-bg-surface'
          : 'border-border hover:border-primary/50 bg-bg-surface'
      }`}
    >
      <CardHeaderBar
        page={page}
        totalCount={totalCount}
        isSplitPoint={isSplitPoint}
        disabled={disabled}
        onRotate={onRotate}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
        onToggleSplitPoint={onToggleSplitPoint}
        onMoveToPosition={onMoveToPosition}
        onHoldStart={onHoldStart}
        onExtractSinglePage={onExtractSinglePage}
      />

      {/* Thumbnail Area */}
      <div className="relative aspect-[3/4] w-full bg-slate-100/50 flex items-center justify-center overflow-hidden">
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${page.pageNumber}`}
            className="h-full w-full object-contain pointer-events-none transition-transform duration-200 ease-in-out"
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
