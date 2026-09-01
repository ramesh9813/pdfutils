import React from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { CardActionsMenu } from './CardActionsMenu';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CardHeaderBarProps {
  page: PdfPageDetail;
  totalCount: number;
  isSplitPoint: boolean;
  disabled?: boolean;
  onRotate?: (pageNumber: number) => void;
  onMoveLeft?: (pageNumber: number) => void;
  onMoveRight?: (pageNumber: number) => void;
  onToggleSplitPoint?: (pageNumber: number) => void;
  onMoveToPosition?: (fromIndex: number, toIndex: number) => void;
  onHoldStart?: (pageNumber: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
}

export const CardHeaderBar: React.FC<CardHeaderBarProps> = ({
  page,
  totalCount,
  isSplitPoint,
  disabled = false,
  onRotate,
  onMoveLeft,
  onMoveRight,
  onToggleSplitPoint,
  onMoveToPosition,
  onHoldStart,
  onExtractSinglePage,
}) => {
  return (
    <div
      className={`flex items-center justify-between px-2 py-1.5 border-b text-xs z-10 transition-colors ${
        isSplitPoint
          ? 'bg-blue-600 text-white border-blue-700'
          : 'bg-bg-subtle/80 text-text-main border-border'
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-bold font-mono text-[11px]">
          p.{page.pageNumber}
        </span>
        {isSplitPoint ? (
          <span className="bg-white/25 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Cut Point
          </span>
        ) : (
          page.originalPageIndex !== page.pageNumber - 1 && (
            <span className="text-[10px] text-amber-600 font-semibold ml-0.5">
              ({page.originalPageIndex + 1})
            </span>
          )
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {onMoveLeft && page.pageNumber > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveLeft(page.pageNumber);
            }}
            title="Move Left"
            className={`p-0.5 rounded ${
              isSplitPoint ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-text-main hover:bg-bg-subtle'
            }`}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
        {onMoveRight && page.pageNumber < totalCount && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveRight(page.pageNumber);
            }}
            title="Move Right"
            className={`p-0.5 rounded ${
              isSplitPoint ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-text-main hover:bg-bg-subtle'
            }`}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotate?.(page.pageNumber);
          }}
          title="Rotate 90°"
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white hover:bg-sky-50 text-text-sub hover:text-primary border border-border shadow-2xs"
        >
          <RotateCw className="h-2.5 w-2.5" />
          <span>90°</span>
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
  );
};
