import React, { useState } from 'react';
import type { PdfPageDetail } from '../../types/pdf.types';
import { downloadRotatedPage } from './downloadSinglePage';
import { Download, Maximize2 } from 'lucide-react';

export interface CardFooterBarProps {
  page: PdfPageDetail;
  sourceBuffer?: ArrayBuffer | null;
  baseDocName?: string;
  onPreviewFull?: (page: PdfPageDetail) => void;
}

export const CardFooterBar: React.FC<CardFooterBarProps> = ({
  page,
  sourceBuffer,
  baseDocName,
  onPreviewFull,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sourceBuffer) return;
    setIsDownloading(true);
    try {
      await downloadRotatedPage(sourceBuffer, page.originalPageIndex + 1, page.rotation, baseDocName);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-1.5 bg-bg-surface border-t border-border z-10">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPreviewFull?.(page);
        }}
        title="Full Preview"
        className="p-1 rounded text-text-muted hover:text-text-main hover:bg-bg-subtle text-[11px]"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading || !sourceBuffer}
        title="Download Page"
        className="flex items-center gap-1 px-2 py-1 rounded bg-bg-subtle hover:bg-primary hover:text-white text-text-main border border-border text-[11px] font-semibold transition-colors shadow-2xs"
      >
        <Download className="h-3 w-3" />
        <span>{isDownloading ? 'Saving...' : 'Download'}</span>
      </button>
    </div>
  );
};
