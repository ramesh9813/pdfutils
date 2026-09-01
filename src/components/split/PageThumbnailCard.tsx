import React from 'react';
import { RotateCw, Maximize2, Check, Loader2 } from 'lucide-react';
import type { PdfPageDetail } from '../../types/pdf.types';

export interface PageThumbnailCardProps {
  page: PdfPageDetail;
  isSelected: boolean;
  onToggleSelect: (pageNumber: number) => void;
  onRotate: (pageNumber: number) => void;
  onPreview: (page: PdfPageDetail) => void;
  disabled?: boolean;
}

export const PageThumbnailCard: React.FC<PageThumbnailCardProps> = ({
  page,
  isSelected,
  onToggleSelect,
  onRotate,
  onPreview,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onToggleSelect(page.pageNumber)}
      className={`group relative flex flex-col rounded border bg-bg-surface transition-all cursor-pointer select-none overflow-hidden ${
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
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
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
