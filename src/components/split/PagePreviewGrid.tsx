import React, { useState } from 'react';
import type { PdfPageDetail, SplitMode } from '../../types/pdf.types';
import { PageThumbnailCard } from './PageThumbnailCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  CheckSquare,
  Square,
  RotateCcw,
  ZoomIn,
  Scissors,
  GripVertical,
  X,
  Sparkles,
} from 'lucide-react';

export interface PagePreviewGridProps {
  pages: PdfPageDetail[];
  selectedPages: number[];
  splitPoints: number[];
  splitMode: SplitMode;
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
  onTogglePage,
  onToggleSplitPoint,
  onClearSplitPoints,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onRotatePage,
  onSplitFromHere,
  onExtractSinglePage,
  onReorderPages,
  onResetPageOrder,
  disabled = false,
}) => {
  const [previewModalPage, setPreviewModalPage] = useState<PdfPageDetail | null>(null);
  const [gridSize, setGridSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [heldIndex, setHeldIndex] = useState<number | null>(null);

  const totalPages = pages.length;
  const selectedCount = selectedPages.length;
  const splitPointCount = splitPoints.length;
  const isOrderChanged = pages.some((p, idx) => p.originalPageIndex !== idx);

  const gridColsClass = {
    sm: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    md: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    lg: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridSize];

  const handleHoldStart = (index: number) => {
    setHeldIndex(index);
  };

  const handleHoldCancel = () => {
    setHeldIndex(null);
  };

  const handleDropOnPage = (targetIndex: number) => {
    if (heldIndex !== null && heldIndex !== targetIndex) {
      onReorderPages?.(heldIndex, targetIndex);
    }
    setHeldIndex(null);
  };

  const handleMovePage = (fromIndex: number, toIndex: number) => {
    onReorderPages?.(fromIndex, toIndex);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3">
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
                variant="secondary"
                size="sm"
                onClick={onDeselectAll}
                disabled={disabled || selectedCount === 0}
                leftIcon={<Square className="h-3.5 w-3.5" />}
              >
                Clear
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInvertSelection(totalPages)}
                disabled={disabled}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Invert
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-text-main bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded">
                <Scissors className="h-3.5 w-3.5 text-primary" />
                <span>
                  {splitPointCount === 0
                    ? 'No split points set yet'
                    : `${splitPointCount} Split Point${splitPointCount > 1 ? 's' : ''} (Yields ${splitPointCount + 1} PDFs)`}
                </span>
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
                  Clear Splits
                </Button>
              )}
            </div>
          )}

          {/* Reset Page Restructure Button if modified */}
          {isOrderChanged && onResetPageOrder && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetPageOrder}
              disabled={disabled}
              leftIcon={<RotateCcw className="h-3.5 w-3.5 text-amber-600" />}
              className="border-amber-300 bg-amber-50/50 text-amber-800 hover:bg-amber-100/60"
            >
              Reset Page Sequence
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-text-sub">
            {splitMode === 'extract' ? (
              <>
                <span className="font-bold text-text-main">{selectedCount}</span> of {totalPages} pages selected
              </>
            ) : (
              <>
                <span className="font-bold text-text-main">{totalPages}</span> pages total
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 border-l border-border pl-3">
            <ZoomIn className="h-3.5 w-3.5 text-text-muted mr-1" />
            <button
              type="button"
              onClick={() => setGridSize('sm')}
              className={`px-2 py-0.5 text-xs rounded font-mono ${
                gridSize === 'sm' ? 'bg-primary text-white' : 'bg-bg-subtle text-text-sub hover:bg-border'
              }`}
            >
              S
            </button>
            <button
              type="button"
              onClick={() => setGridSize('md')}
              className={`px-2 py-0.5 text-xs rounded font-mono ${
                gridSize === 'md' ? 'bg-primary text-white' : 'bg-bg-subtle text-text-sub hover:bg-border'
              }`}
            >
              M
            </button>
            <button
              type="button"
              onClick={() => setGridSize('lg')}
              className={`px-2 py-0.5 text-xs rounded font-mono ${
                gridSize === 'lg' ? 'bg-primary text-white' : 'bg-bg-subtle text-text-sub hover:bg-border'
              }`}
            >
              L
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Interaction Guide Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded bg-sky-50 border border-sky-200 px-3.5 py-2 text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-600 shrink-0" />
          <span>
            <strong>Interactions:</strong> Single-click image for <strong>Full Page</strong> • Double-click for <strong>Blue Split Point</strong> • Hold ~1s to <strong>Restructure Position</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-sky-700 bg-white/70 px-2 py-0.5 rounded border border-sky-200">
          Python Slice Syntax (e.g. 1:5, 6:9)
        </span>
      </div>

      {/* Held Card Active Reordering Floating Banner */}
      {heldIndex !== null && (
        <div className="sticky top-16 z-40 flex items-center justify-between gap-3 rounded bg-amber-500 text-white px-4 py-2.5 shadow-lg border border-amber-600 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <GripVertical className="h-4 w-4 shrink-0" />
            <span>
              Page {pages[heldIndex]?.pageNumber} is picked up! Click or drag onto any other page to place it there.
            </span>
          </div>
          <button
            type="button"
            onClick={handleHoldCancel}
            className="flex items-center gap-1 text-xs bg-slate-900/40 hover:bg-slate-900/60 px-2.5 py-1 rounded font-medium transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Pages Grid */}
      <div className={`grid gap-3 sm:gap-4 ${gridColsClass}`}>
        {pages.map((page, idx) => {
          const isSplit = splitPoints.includes(page.pageNumber);
          const splitIdx = splitPoints.indexOf(page.pageNumber);
          return (
            <PageThumbnailCard
              key={`${page.originalPageIndex}-${idx}`}
              page={page}
              index={idx}
              totalPages={totalPages}
              isSelected={selectedPages.includes(page.pageNumber)}
              isSplitPoint={isSplit}
              splitPointIndex={splitIdx >= 0 ? splitIdx : undefined}
              splitMode={splitMode}
              onToggleSelect={onTogglePage}
              onToggleSplitPoint={onToggleSplitPoint}
              onRotate={onRotatePage}
              onPreview={setPreviewModalPage}
              onSplitFromHere={onSplitFromHere}
              onExtractSinglePage={onExtractSinglePage}
              isHeld={heldIndex === idx}
              hasAnyHeld={heldIndex !== null}
              onHoldStart={handleHoldStart}
              onHoldCancel={handleHoldCancel}
              onDropOnPage={handleDropOnPage}
              onMovePage={handleMovePage}
              disabled={disabled}
            />
          );
        })}
      </div>

      {/* Single Page Expanded Modal */}
      <Modal
        isOpen={previewModalPage !== null}
        onClose={() => setPreviewModalPage(null)}
        title={`Preview Page ${previewModalPage?.pageNumber || ''} ${
          previewModalPage && previewModalPage.originalPageIndex !== previewModalPage.pageNumber - 1
            ? `(Original #${previewModalPage.originalPageIndex + 1})`
            : ''
        }`}
        maxWidth="2xl"
      >
        {previewModalPage && (
          <div className="flex flex-col items-center justify-center p-2">
            <div className="max-h-[70vh] flex items-center justify-center overflow-auto rounded border border-border bg-bg-subtle p-2">
              <img
                src={previewModalPage.thumbnailUrl}
                alt={`Page ${previewModalPage.pageNumber}`}
                className="max-h-[65vh] object-contain rounded"
              />
            </div>
            <div className="mt-4 flex items-center justify-between w-full text-xs text-text-muted">
              <span>Dimensions: {Math.round(previewModalPage.width)} × {Math.round(previewModalPage.height)} pt</span>
              <span>Orientation: {previewModalPage.rotation}°</span>
              <button
                type="button"
                onClick={() => {
                  onToggleSplitPoint(previewModalPage.pageNumber);
                  setPreviewModalPage(null);
                }}
                className="flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <Scissors className="h-3.5 w-3.5" />
                {splitPoints.includes(previewModalPage.pageNumber)
                  ? 'Remove Split Point'
                  : 'Split After This Page'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

