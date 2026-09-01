import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Maximize2,
  Check,
  Loader2,
  MoreVertical,
  Scissors,
  FileCheck,
} from 'lucide-react';
import type { PdfPageDetail } from '../../types/pdf.types';

export interface PageThumbnailCardProps {
  page: PdfPageDetail;
  totalPages: number;
  isSelected: boolean;
  onToggleSelect: (pageNumber: number) => void;
  onRotate: (pageNumber: number) => void;
  onPreview: (page: PdfPageDetail) => void;
  onSplitFromHere?: (pageNumber: number) => void;
  onExtractSinglePage?: (pageNumber: number) => void;
  disabled?: boolean;
}

export const PageThumbnailCard: React.FC<PageThumbnailCardProps> = ({
  page,
  totalPages,
  isSelected,
  onToggleSelect,
  onRotate,
  onPreview,
  onSplitFromHere,
  onExtractSinglePage,
  disabled = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      onClick={() => !disabled && onToggleSelect(page.pageNumber)}
      className={`group relative flex flex-col rounded border bg-bg-surface transition-all cursor-pointer select-none overflow-visible ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : 'border-border hover:border-text-muted hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-bg-subtle/70 px-2.5 py-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <div
            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
              isSelected
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-bg-surface'
            }`}
          >
            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
          <span className="font-semibold text-text-main">
            p.{page.pageNumber}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
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

          {/* Three dots menu button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              title="Page Options"
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
                className="absolute right-0 top-full mt-1.5 w-56 rounded border border-border bg-bg-surface p-1.5 shadow-md z-30 text-xs flex flex-col gap-1"
              >
                <div className="px-2 py-1 border-b border-border text-[11px] font-semibold text-text-muted">
                  Page {page.pageNumber} Actions
                </div>

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

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onPreview(page);
                  }}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-text-main hover:bg-bg-subtle transition-colors"
                >
                  <Maximize2 className="h-4 w-4 text-text-sub shrink-0" />
                  <span>View Full Preview</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Area */}
      <div className="relative flex items-center justify-center p-3 bg-bg-subtle/30 min-h-[160px] aspect-[3/4]">
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${page.pageNumber}`}
            className="max-h-full max-w-full object-contain rounded border border-border shadow-xs"
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

        {/* Selected Overlay Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-sky-500/5 pointer-events-none" />
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-border bg-bg-surface px-2.5 py-1 text-[11px] text-text-muted">
        <span>{page.rotation !== 0 ? `${page.rotation}°` : '0°'}</span>
        <span>{Math.round(page.width)}×{Math.round(page.height)} pt</span>
      </div>
    </div>
  );
};
