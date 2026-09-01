import { useState, useCallback, useRef } from 'react';
import type { PdfDocumentInfo, PdfPageDetail } from '../types/pdf.types';
import { extractDocumentWithThumbnails, renderPageThumbnail } from '../services/pdfRenderer';

export function usePdfSession() {
  const [docInfo, setDocInfo] = useState<PdfDocumentInfo | null>(null);
  const [pages, setPages] = useState<PdfPageDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const masterBytesRef = useRef<Uint8Array | null>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cancel any previous renders
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const currentAbortController = new AbortController();
    abortControllerRef.current = currentAbortController;

    try {
      const rawBuffer = await file.arrayBuffer();
      // Master copy stored in memory that is NEVER directly transferred to workers
      const masterBytes = new Uint8Array(rawBuffer);
      masterBytesRef.current = masterBytes;

      const newDocInfo: PdfDocumentInfo = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        pageCount: 0,
        file,
        // Always provide a fresh slice buffer so pdf-lib has a non-detached buffer
        arrayBuffer: masterBytes.slice().buffer as ArrayBuffer,
      };

      // Stream document parsing and progressive thumbnail generation
      const initialPages = await extractDocumentWithThumbnails(
        masterBytes,
        280,
        (pageNumber, thumbnailUrl) => {
          if (currentAbortController.signal.aborted) return;
          setPages((prev) =>
            prev.map((p) =>
              p.pageNumber === pageNumber
                ? { ...p, thumbnailUrl, isLoadingThumbnail: false }
                : p
            )
          );
        },
        currentAbortController.signal
      );

      newDocInfo.pageCount = initialPages.length;
      setPages(initialPages);
      setDocInfo(newDocInfo);
    } catch (err: unknown) {
      console.error('Error loading PDF:', err);
      const msg = err instanceof Error ? err.message : 'Failed to parse PDF document';
      setError(`Failed to read PDF document: ${msg}`);
      setDocInfo(null);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFreshBuffer = useCallback((): ArrayBuffer => {
    if (masterBytesRef.current) {
      return masterBytesRef.current.slice().buffer as ArrayBuffer;
    }
    return new ArrayBuffer(0);
  }, []);

  const resetSession = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    masterBytesRef.current = null;
    setDocInfo(null);
    setPages([]);
    setIsLoading(false);
    setError(null);
  }, []);

  const rotatePage = useCallback(async (pageNumber: number) => {
    if (!masterBytesRef.current) return;

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
      const thumbUrl = await renderPageThumbnail(
        masterBytesRef.current,
        pageNumber,
        280,
        newRot
      );

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
  }, [pages]);

  return {
    docInfo,
    pages,
    isLoading,
    error,
    loadFile,
    getFreshBuffer,
    resetSession,
    rotatePage,
  };
}
