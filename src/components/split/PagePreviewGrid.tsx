import React, { useState } from 'react';
import type { PdfPageDetail, SplitMode } from '../../types/pdf.types';
import { PageThumbnailCard } from './PageThumbnailCard';
import { PagePreviewToolbar } from './PagePreviewToolbar';
import { PagePreviewModal } from './PagePreviewModal';
import { Hand, X } from 'lucide-react';

export interface PagePreviewGridProps {
  pages: PdfPageDetail[];
  selectedPages: number[];
  splitPoints: number[];
  splitMode: SplitMode;
  sourceBuffer?: ArrayBuffer | null;
  baseDocName?: string;
  onTogglePage: (pageNumber: number) => void;
  onToggleSplitPoint: (pageNumber: number) => void;
  onClearSplitPoints: () => void;
  onSelectAll: (totalCount: number) => void;
  onDeselectAll: () => void;
  onInvertSelection: (totalCount: number) => void;
  onRotatePage: (pageNumber: number) => void;
  onSplitFromHere?: (pageNumber: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
  onReorderPages?: (fromIndex: number, toIndex: number) => void;
  onResetPageOrder?: () => void;
  disabled?: boolean;
}

export const PagePreviewGrid: React.FC<PagePreviewGridProps> = ({
  pages,
  selectedPages,
  splitPoints,
  splitMode,
  sourceBuffer,
  baseDocName,
  onTogglePage,
  onToggleSplitPoint,
  onClearSplitPoints,
  onSelectAll,
  onDeselectAll,
  onRotatePage,
  onExtractSinglePage,
  onReorderPages,
  onResetPageOrder,
  disabled = false,
}) => {
  const [previewModalPage, setPreviewModalPage] = useState<PdfPageDetail | null>(null);
  const [gridSize, setGridSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [heldIndex, setHeldIndex] = useState<number | null>(null);

  const totalPages = pages.length;
  const isOrderChanged = pages.some((p, idx) => p.originalPageIndex !== idx);

  const gridColsClass = {
    sm: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    md: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    lg: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridSize];

  const handleDropOnPage = (targetPageNum: number) => {
    if (heldIndex !== null) {
      const from = heldIndex;
      const to = targetPageNum - 1;
      if (from !== to) {
        onReorderPages?.(from, to);
      }
      setHeldIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Held Card Floating Instruction Banner */}
      {heldIndex !== null && (
        <div className="sticky top-2 z-30 flex items-center justify-between gap-3 bg-amber-500 text-white px-4 py-2.5 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Hand className="h-4 w-4" />
            <span>
              Page {heldIndex + 1} is picked up! Click on any other page to move it to that position.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setHeldIndex(null)}
            className="p-1 hover:bg-amber-600 rounded text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Toolbar */}
      <PagePreviewToolbar
        splitMode={splitMode}
        totalPages={totalPages}
        selectedCount={selectedPages.length}
        splitPointCount={splitPoints.length}
        isOrderChanged={isOrderChanged}
        gridSize={gridSize}
        disabled={disabled}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onClearSplitPoints={onClearSplitPoints}
        onResetPageOrder={onResetPageOrder}
        onGridSizeChange={setGridSize}
      />

      {/* Pages Grid */}
      <div className={`grid gap-3.5 sm:gap-4 ${gridColsClass}`}>
        {pages.map((page, index) => {
          const isSelected = selectedPages.includes(page.pageNumber);
          const splitIdx = splitPoints.indexOf(page.pageNumber);
          const isSplitPoint = splitIdx !== -1;
          const isHeld = heldIndex === index;
          const isDropTarget = heldIndex !== null && heldIndex !== index;

          return (
            <PageThumbnailCard
              key={`${page.pageNumber}-${page.originalPageIndex}`}
              page={page}
              totalCount={totalPages}
              isSelected={isSelected}
              isSplitPoint={isSplitPoint}
              splitIndex={splitIdx}
              isHeld={isHeld}
              isDropTarget={isDropTarget}
              disabled={disabled}
              sourceBuffer={sourceBuffer}
              baseDocName={baseDocName}
              onToggleSelect={splitMode === 'extract' ? () => onTogglePage(page.pageNumber) : undefined}
              onToggleSplitPoint={() => onToggleSplitPoint(page.pageNumber)}
              onRotate={() => onRotatePage(page.pageNumber)}
              onPreviewFull={() => setPreviewModalPage(page)}
              onHoldStart={() => setHeldIndex(index)}
              onDropOnPage={handleDropOnPage}
              onMoveLeft={() => index > 0 && onReorderPages?.(index, index - 1)}
              onMoveRight={() => index < totalPages - 1 && onReorderPages?.(index, index + 1)}
              onMoveToPosition={(from, to) => onReorderPages?.(from, to)}
              onExtractSinglePage={onExtractSinglePage}
            />
          );
        })}
      </div>

      {/* Full Page Preview Modal */}
      <PagePreviewModal
        page={previewModalPage}
        onClose={() => setPreviewModalPage(null)}
        onRotate={onRotatePage}
      />
    </div>
  );
};
