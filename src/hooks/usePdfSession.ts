import { useState, useCallback, useRef } from 'react';
import type { PdfDocumentInfo, PdfPageDetail } from '../types/pdf.types';
import { extractPdfPagesMetadata, renderPageThumbnail } from '../services/pdfRenderer';

export function usePdfSession() {
  const [docInfo, setDocInfo] = useState<PdfDocumentInfo | null>(null);
  const [pages, setPages] = useState<PdfPageDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cancel any previous background thumbnail renders
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const currentAbortController = new AbortController();
    abortControllerRef.current = currentAbortController;

    try {
      const buffer = await file.arrayBuffer();
      const metadata = await extractPdfPagesMetadata(buffer);

      const initialPages: PdfPageDetail[] = metadata.map((m) => ({
        ...m,
        isLoadingThumbnail: true,
      }));

      setPages(initialPages);
      setDocInfo({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        pageCount: metadata.length,
        file,
        arrayBuffer: buffer,
      });

      // Progressively render thumbnails asynchronously in small batches
      setTimeout(async () => {
        for (let i = 0; i < metadata.length; i++) {
          if (currentAbortController.signal.aborted) break;

          try {
            const pageNum = metadata[i].pageNumber;
            const thumbUrl = await renderPageThumbnail(buffer, pageNum, 280);

            if (!currentAbortController.signal.aborted) {
              setPages((prev) =>
                prev.map((p) =>
                  p.pageNumber === pageNum
                    ? { ...p, thumbnailUrl: thumbUrl, isLoadingThumbnail: false }
                    : p
                )
              );
            }
          } catch (err) {
            console.error(`Error rendering page ${metadata[i].pageNumber}:`, err);
            if (!currentAbortController.signal.aborted) {
              setPages((prev) =>
                prev.map((p) =>
                  p.pageNumber === metadata[i].pageNumber
                    ? { ...p, isLoadingThumbnail: false }
                    : p
                )
              );
            }
          }
        }
      }, 50);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse PDF document';
      setError(`Failed to read PDF document: ${msg}`);
      setDocInfo(null);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSession = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setDocInfo(null);
    setPages([]);
    setIsLoading(false);
    setError(null);
  }, []);

  const rotatePage = useCallback(async (pageNumber: number) => {
    if (!docInfo) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.pageNumber === pageNumber) {
          const newRot = (p.rotation + 90) % 360;
          return { ...p, rotation: newRot, isLoadingThumbnail: true };
        }
        return p;
      })
    );

    try {
      const page = pages.find((p) => p.pageNumber === pageNumber);
      const newRot = page ? (page.rotation + 90) % 360 : 90;
      const thumbUrl = await renderPageThumbnail(docInfo.arrayBuffer, pageNumber, 280, newRot);

      setPages((prev) =>
        prev.map((p) =>
          p.pageNumber === pageNumber
            ? { ...p, thumbnailUrl: thumbUrl, isLoadingThumbnail: false }
            : p
        )
      );
    } catch (err) {
      console.error('Error re-rendering rotated page:', err);
    }
  }, [docInfo, pages]);

  return {
    docInfo,
    pages,
    isLoading,
    error,
    loadFile,
    resetSession,
    rotatePage,
  };
}
