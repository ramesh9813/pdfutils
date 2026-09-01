import React from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RotateCw } from 'lucide-react';

export interface PagePreviewModalProps {
  page: PdfPageDetail | null;
  onClose: () => void;
  onRotate?: (pageNumber: number) => void;
}

export const PagePreviewModal: React.FC<PagePreviewModalProps> = ({
  page,
  onClose,
  onRotate,
}) => {
  if (!page) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Page ${page.pageNumber} High-Fidelity Preview (Original: Page ${page.originalPageIndex + 1})`}
      maxWidth="2xl"
    >
      <div className="flex flex-col items-center gap-4 p-2">
        <div className="relative max-h-[70vh] w-full flex items-center justify-center overflow-auto rounded bg-slate-900/5 p-4 border border-border">
          {page.thumbnailUrl ? (
            <img
              src={page.thumbnailUrl}
              alt={`Page ${page.pageNumber}`}
              className="max-h-[65vh] object-contain shadow-lg rounded transition-transform"
              style={{ transform: `rotate(${page.rotation}deg)` }}
            />
          ) : (
            <div className="p-12 text-center text-text-muted">Loading preview...</div>
          )}
        </div>

        <div className="flex items-center justify-between w-full pt-2 border-t border-border">
          <div className="text-xs text-text-muted">
            Rotation: <strong>{page.rotation}°</strong>
          </div>

          <div className="flex items-center gap-2">
            {onRotate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRotate(page.pageNumber)}
                leftIcon={<RotateCw className="h-3.5 w-3.5" />}
              >
                Rotate 90° Clockwise
              </Button>
            )}
            <Button type="button" variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
