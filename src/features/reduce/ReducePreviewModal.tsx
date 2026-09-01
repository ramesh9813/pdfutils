import React, { useState, useEffect } from 'react';
import type { ColorAdjustmentOptions } from './reduceTypes';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { renderPageThumbnail } from '../../services/pdfRenderer';
import { ChevronLeft, ChevronRight, Download, Sparkles, X, Loader2 } from 'lucide-react';

export interface ReducePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileBuffer: ArrayBuffer | null;
  totalPages: number;
  visuals: ColorAdjustmentOptions;
  onDownloadOrReduce: () => void;
  isProcessing: boolean;
  hasResult: boolean;
}

export const ReducePreviewModal: React.FC<ReducePreviewModalProps> = ({
  isOpen,
  onClose,
  fileBuffer,
  totalPages,
  visuals,
  onDownloadOrReduce,
  isProcessing,
  hasResult,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageThumb, setPageThumb] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  useEffect(() => {
    if (!isOpen || !fileBuffer) return;
    setIsLoadingPage(true);
    renderPageThumbnail(fileBuffer, currentPage, 800)
      .then((thumb) => {
        setPageThumb(thumb);
        setIsLoadingPage(false);
      })
      .catch(() => {
        setPageThumb(null);
        setIsLoadingPage(false);
      });
  }, [isOpen, fileBuffer, currentPage]);

  const boostFactor = 1 + (visuals.colorBoostPercent / 100) * 0.35;
  const filterStyle = `grayscale(${visuals.grayscalePercent}%) brightness(${visuals.brightnessPercent}%) contrast(${visuals.contrastPercent * boostFactor}%) saturate(${visuals.saturationPercent * boostFactor}%)`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enhanced PDF Preview" maxWidth="4xl">
      <div className="flex flex-col gap-3 p-2">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoadingPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded text-text-sub hover:text-text-main hover:bg-bg-subtle disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold font-mono text-text-main px-1">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoadingPage}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded text-text-sub hover:text-text-main hover:bg-bg-subtle disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1 items-center">
            {visuals.grayscalePercent > 0 && (
              <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                B&W {visuals.grayscalePercent}%
              </span>
            )}
            {visuals.sharpnessPercent > 0 && (
              <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                Sharp +{visuals.sharpnessPercent}%
              </span>
            )}
            {visuals.colorBoostPercent > 0 && (
              <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                Boost +{visuals.colorBoostPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="relative max-h-[62vh] min-h-[300px] w-full flex items-center justify-center overflow-auto rounded-lg bg-slate-900/5 p-4 border border-border">
          {isLoadingPage ? (
            <div className="flex flex-col items-center gap-2 text-text-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-semibold">Rendering page {currentPage}...</span>
            </div>
          ) : pageThumb ? (
            <img
              src={pageThumb}
              alt={`Page ${currentPage} Preview`}
              className="max-h-[58vh] object-contain shadow-md rounded transition-all duration-150"
              style={{ filter: filterStyle }}
            />
          ) : (
            <div className="text-xs text-text-muted">Failed to load preview</div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-[11px] text-text-muted">
            Inspect changes. If satisfied, click reduce & download below or alter sliders.
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} leftIcon={<X className="h-3.5 w-3.5" />}>
              Close Preview
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isProcessing}
              onClick={() => {
                onClose();
                onDownloadOrReduce();
              }}
              leftIcon={hasResult ? <Download className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            >
              {hasResult ? 'Download PDF' : 'Reduce & Enhance'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
