import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type {
  SplitOptions,
  SplitMode,
  ProgressState,
  SplitOutput,
} from '../types/pdf.types';
import {
  splitPdf,
  parseRangeString,
  splitPointsToPythonRanges,
  rangesToSplitPoints,
} from '../services/pdfSplitter';

export function usePdfSplit(initialFilename: string = 'document') {
  const [options, setOptions] = useState<SplitOptions>({
    mode: 'range',
    selectedPages: [],
    splitPoints: [],
    customRanges: '1:1',
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

  const toggleSplitPoint = useCallback((pageNumber: number, totalPages: number) => {
    if (pageNumber < 1 || pageNumber >= totalPages) return;
    setOptions((prev) => {
      const exists = prev.splitPoints.includes(pageNumber);
      const newSplitPoints = exists
        ? prev.splitPoints.filter((p) => p !== pageNumber)
        : [...prev.splitPoints, pageNumber].sort((a, b) => a - b);

      const newRangesStr = splitPointsToPythonRanges(newSplitPoints, totalPages);
      const parsed = parseRangeString(newRangesStr, totalPages);

      return {
        ...prev,
        mode: 'range',
        splitPoints: newSplitPoints,
        customRanges: newRangesStr,
        parsedRanges: parsed.valid ? parsed.ranges : prev.parsedRanges,
      };
    });
  }, []);

  const clearSplitPoints = useCallback((totalPages: number) => {
    setOptions((prev) => ({
      ...prev,
      splitPoints: [],
      customRanges: `1:${totalPages}`,
      parsedRanges: [{ start: 1, end: totalPages }],
    }));
  }, []);

  const setCustomRanges = useCallback((rangesStr: string, totalPages?: number) => {
    setOptions((prev) => {
      let newSplitPoints = prev.splitPoints;
      let parsedRanges = prev.parsedRanges;

      if (totalPages && totalPages > 0) {
        const parsed = parseRangeString(rangesStr, totalPages);
        if (parsed.valid) {
          parsedRanges = parsed.ranges;
          newSplitPoints = rangesToSplitPoints(parsed.ranges, totalPages);
        }
      }

      return {
        ...prev,
        customRanges: rangesStr,
        splitPoints: newSplitPoints,
        parsedRanges,
      };
    });
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
    async (
      sourceBuffer: ArrayBuffer,
      totalPages: number,
      pageOrderMapping?: number[],
      pageRotations?: { [originalIndex: number]: number }
    ) => {
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
        const output = await splitPdf(
          sourceBuffer,
          options,
          (current, total, message) => {
            setProgress({
              status: current === 100 ? 'completed' : 'processing',
              current,
              total,
              message,
            });
          },
          pageOrderMapping,
          pageRotations
        );

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
    toggleSplitPoint,
    clearSplitPoints,
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

