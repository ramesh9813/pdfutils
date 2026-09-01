import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type {
  MergeItem,
  MergeOptions,
  MergeOutput,
  ProgressState,
  JoinPosition,
} from '../types/pdf.types';
import { getPdfPageCount, renderPageThumbnail } from '../services/pdfRenderer';
import { mergePdfs, buildMergeAssembly } from '../services/pdfMerger';
import { useSettings } from '../context/SettingsContext';

export function usePdfMerge() {
  const { settings } = useSettings();
  const defaultPos: JoinPosition =
    settings.merge.defaultPosition === 'start'
      ? 'beginning'
      : settings.merge.defaultPosition === 'inside'
      ? 'inside'
      : 'end';

  const [items, setItems] = useState<MergeItem[]>([]);
  const [options, setOptions] = useState<MergeOptions>({
    outputFilename: 'merged-documents.pdf',
  });
  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    current: 0,
    total: 100,
    message: '',
  });
  const [result, setResult] = useState<MergeOutput | null>(null);

  const addFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (validFiles.length === 0) return;

    for (const file of validFiles) {
      try {
        const rawBuffer = await file.arrayBuffer();
        const masterBytes = new Uint8Array(rawBuffer);
        const pageCount = await getPdfPageCount(masterBytes);
        const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

        const newItem: MergeItem = {
          id,
          file,
          arrayBuffer: masterBytes.slice().buffer as ArrayBuffer,
          name: file.name,
          size: file.size,
          pageCount,
          pageRange: 'all',
          rotationOffset: 0,
          joinPosition: defaultPos,
        };

        setItems((prev) => [...prev, newItem]);

        renderPageThumbnail(masterBytes, 1, 200)
          .then((thumb) => {
            setItems((prev) => prev.map((it) => (it.id === id ? { ...it, thumbnailUrl: thumb } : it)));
          })
          .catch((err) => console.error('Error rendering thumbnail:', err));
      } catch (err) {
        console.error('Error reading PDF file for merge:', err);
      }
    }
  }, [defaultPos]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const updatePageRange = useCallback((id: string, pageRange: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, pageRange } : item)));
  }, []);

  const rotateItem = useCallback((id: string, delta: number = 90) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const current = item.rotationOffset || 0;
        const nextRot = (current + delta + 360) % 360;
        return { ...item, rotationOffset: nextRot };
      })
    );
  }, []);

  const updateJoinPosition = useCallback(
    (id: string, joinPosition: JoinPosition, targetDocumentId?: string, insertAfterPage?: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, joinPosition, targetDocumentId, insertAfterPage } : item
        )
      );
    },
    []
  );

  const setOutputFilename = useCallback((name: string) => {
    const filename = name.trim().toLowerCase().endsWith('.pdf') ? name.trim() : `${name.trim()}.pdf`;
    setOptions((prev) => ({ ...prev, outputFilename: filename }));
  }, []);

  const totalEstimatedPages = useMemo(() => {
    try {
      return buildMergeAssembly(items).length;
    } catch {
      return items.reduce((acc, item) => acc + item.pageCount, 0);
    }
  }, [items]);

  const executeMerge = useCallback(async () => {
    if (items.length < 2) {
      setProgress({
        status: 'error',
        current: 0,
        total: 100,
        message: 'Please add at least 2 PDF files to merge.',
        error: 'Please add at least 2 PDF files to merge.',
      });
      return null;
    }

    setProgress({ status: 'processing', current: 0, total: 100, message: 'Starting merge engine...' });

    try {
      const output = await mergePdfs(items, options, (current, total, message) => {
        setProgress({ status: current === 100 ? 'completed' : 'processing', current, total, message });
      });
      setResult(output);
      return output;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Merge failed';
      setProgress({ status: 'error', current: 0, total: 100, message: msg, error: msg });
      return null;
    }
  }, [items, options]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    saveAs(result.blob, result.filename);
    if (settings.merge.autoClear) {
      setItems([]);
      setResult(null);
    }
  }, [result, settings.merge.autoClear]);

  const resetMerge = useCallback(() => {
    setResult(null);
    setProgress({ status: 'idle', current: 0, total: 100, message: '' });
  }, []);

  const isProcessing = useMemo(() => progress.status === 'processing', [progress.status]);

  return {
    items,
    options,
    progress,
    result,
    isProcessing,
    totalEstimatedPages,
    addFiles,
    removeItem,
    clearItems,
    moveItem,
    updatePageRange,
    rotateItem,
    updateJoinPosition,
    setOutputFilename,
    executeMerge,
    downloadResult,
    resetMerge,
  };
}
