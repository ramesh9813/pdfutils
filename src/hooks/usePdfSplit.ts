import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type {
  SplitOptions,
  SplitMode,
  ProgressState,
  SplitOutput,
} from '../types/pdf.types';
import { splitPdf, parseRangeString } from '../services/pdfSplitter';

export function usePdfSplit(initialFilename: string = 'document') {
  const [options, setOptions] = useState<SplitOptions>({
    mode: 'extract',
    selectedPages: [],
    customRanges: '1',
    parsedRanges: [{ start: 1, end: 1 }],
    everyN: 2,
    mergeExtracted: true,
    filenamePrefix: initialFilename.replace(/\.pdf$/i, ''),
  });

  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    current: 0,
    total: 100,
    message: '',
  });

  const [result, setResult] = useState<SplitOutput | null>(null);

  const setMode = useCallback((mode: SplitMode) => {
    setOptions((prev) => ({ ...prev, mode }));
  }, []);

  const togglePage = useCallback((pageNumber: number) => {
    setOptions((prev) => {
      const exists = prev.selectedPages.includes(pageNumber);
      const updated = exists
        ? prev.selectedPages.filter((p) => p !== pageNumber)
        : [...prev.selectedPages, pageNumber];
      return { ...prev, selectedPages: updated };
    });
  }, []);

  const selectAll = useCallback((totalCount: number) => {
    setOptions((prev) => ({
      ...prev,
      selectedPages: Array.from({ length: totalCount }, (_, i) => i + 1),
    }));
  }, []);

  const deselectAll = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      selectedPages: [],
    }));
  }, []);

  const invertSelection = useCallback((totalCount: number) => {
    setOptions((prev) => {
      const all = Array.from({ length: totalCount }, (_, i) => i + 1);
      const inverted = all.filter((p) => !prev.selectedPages.includes(p));
      return { ...prev, selectedPages: inverted };
    });
  }, []);

  const setCustomRanges = useCallback((rangesStr: string) => {
    setOptions((prev) => ({ ...prev, customRanges: rangesStr }));
  }, []);

  const setEveryN = useCallback((everyN: number) => {
    setOptions((prev) => ({ ...prev, everyN: Math.max(1, everyN) }));
  }, []);

  const setMergeExtracted = useCallback((mergeExtracted: boolean) => {
    setOptions((prev) => ({ ...prev, mergeExtracted }));
  }, []);

  const setFilenamePrefix = useCallback((filenamePrefix: string) => {
    setOptions((prev) => ({ ...prev, filenamePrefix }));
  }, []);

  const validateConfig = useCallback(
    (totalCount: number): { valid: boolean; error?: string } => {
      if (options.mode === 'extract') {
        if (options.selectedPages.length === 0) {
          return { valid: false, error: 'Please select at least one page to extract.' };
        }
      } else if (options.mode === 'range') {
        const { valid, error } = parseRangeString(options.customRanges, totalCount);
        if (!valid) {
          return { valid: false, error };
        }
      } else if (options.mode === 'every_n') {
        if (options.everyN < 1) {
          return { valid: false, error: 'Page interval must be at least 1.' };
        }
      }
      return { valid: true };
    },
    [options]
  );

  const executeSplit = useCallback(
    async (sourceBuffer: ArrayBuffer, totalPages: number) => {
      const validation = validateConfig(totalPages);
      if (!validation.valid) {
        setProgress({
          status: 'error',
          current: 0,
          total: 100,
          message: validation.error || 'Invalid configuration',
          error: validation.error,
        });
        return null;
      }

      setProgress({
        status: 'processing',
        current: 0,
        total: 100,
        message: 'Initializing split...',
      });

      try {
        const output = await splitPdf(sourceBuffer, options, (current, total, message) => {
          setProgress({
            status: current === 100 ? 'completed' : 'processing',
            current,
            total,
            message,
          });
        });

        setResult(output);
        return output;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Split process failed';
        setProgress({
          status: 'error',
          current: 0,
          total: 100,
          message: msg,
          error: msg,
        });
        return null;
      }
    },
    [options, validateConfig]
  );

  const downloadResult = useCallback(() => {
    if (!result) return;
    saveAs(result.blob, result.filename);
  }, [result]);

  const resetSplit = useCallback(() => {
    setResult(null);
    setProgress({
      status: 'idle',
      current: 0,
      total: 100,
      message: '',
    });
  }, []);

  const isProcessing = useMemo(() => {
    return progress.status === 'processing' || progress.status === 'zipping';
  }, [progress.status]);

  return {
    options,
    progress,
    result,
    isProcessing,
    setMode,
    togglePage,
    selectAll,
    deselectAll,
    invertSelection,
    setCustomRanges,
    setEveryN,
    setMergeExtracted,
    setFilenamePrefix,
    validateConfig,
    executeSplit,
    downloadResult,
    resetSplit,
  };
}
