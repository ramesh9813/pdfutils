import React, { useState } from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { PageThumbnailCard } from './PageThumbnailCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { CheckSquare, Square, RotateCcw, ZoomIn } from 'lucide-react';

export interface PagePreviewGridProps {
  pages: PdfPageDetail[];
  selectedPages: number[];
  onTogglePage: (pageNumber: number) => void;
  onSelectAll: (totalCount: number) => void;
  onDeselectAll: () => void;
  onInvertSelection: (totalCount: number) => void;
  onRotatePage: (pageNumber: number) => void;
  onSplitFromHere?: (pageNumber: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
  disabled?: boolean;
}

export const PagePreviewGrid: React.FC<PagePreviewGridProps> = ({
  pages,
  selectedPages,
  onTogglePage,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onRotatePage,
  onSplitFromHere,
  onExtractSinglePage,
  disabled = false,
}) => {
  const [previewModalPage, setPreviewModalPage] = useState<PdfPageDetail | null>(null);
  const [gridSize, setGridSize] = useState<'sm' | 'md' | 'lg'>('md');

  const totalPages = pages.length;
  const selectedCount = selectedPages.length;

  const gridColsClass = {
    sm: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    md: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    lg: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridSize];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-text-sub">
            <span className="font-bold text-text-main">{selectedCount}</span> of {totalPages} pages selected
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

      {/* Pages Grid */}
      <div className={`grid gap-3 sm:gap-4 ${gridColsClass}`}>
        {pages.map((page) => (
          <PageThumbnailCard
            key={page.pageNumber}
            page={page}
            totalPages={totalPages}
            isSelected={selectedPages.includes(page.pageNumber)}
            onToggleSelect={onTogglePage}
            onRotate={onRotatePage}
            onPreview={setPreviewModalPage}
            onSplitFromHere={onSplitFromHere}
            onExtractSinglePage={onExtractSinglePage}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Single Page Expanded Modal */}
      <Modal
        isOpen={previewModalPage !== null}
        onClose={() => setPreviewModalPage(null)}
        title={`Preview Page ${previewModalPage?.pageNumber || ''}`}
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
