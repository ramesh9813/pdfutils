import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type { SplitOptions, SplitMode, ProgressState, SplitOutput } from '../types/pdf.types';
import { splitPdf } from '../services/pdfSplitter';
import { computeToggleSplitPoint, computeCustomRangesUpdate } from '../features/split/splitStateHelpers';

import { useSettings } from '../context/SettingsContext';

export function usePdfSplit(initialFilename: string = 'document') {
  const { settings } = useSettings();
  const defaultMode: SplitMode =
    settings.split.defaultMode === 'visual'
      ? 'extract'
      : settings.split.defaultMode === 'all'
      ? 'every_n'
      : 'range';

  const [options, setOptions] = useState<SplitOptions>({
    mode: defaultMode,
    selectedPages: [],
    splitPoints: [],
    customRanges: settings.split.defaultSlice || '1:1',
    parsedRanges: [{ start: 1, end: 1 }],
    everyN: 2,
    mergeExtracted: !settings.split.autoZip,
    filenamePrefix: initialFilename.replace(/\.pdf$/i, ''),
  });

  const [selectedSectionIndices, setSelectedSectionIndices] = useState<number[]>([0]);

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
    setOptions((prev) => ({
      ...prev,
      selectedPages: prev.selectedPages.includes(pageNumber)
        ? prev.selectedPages.filter((p) => p !== pageNumber)
        : [...prev.selectedPages, pageNumber],
    }));
  }, []);

  const selectAll = useCallback((totalCount: number) => {
    setOptions((prev) => ({
      ...prev,
      selectedPages: Array.from({ length: totalCount }, (_, i) => i + 1),
    }));
  }, []);

  const deselectAll = useCallback(() => {
    setOptions((prev) => ({ ...prev, selectedPages: [] }));
  }, []);

  const invertSelection = useCallback((totalCount: number) => {
    setOptions((prev) => ({
      ...prev,
      selectedPages: Array.from({ length: totalCount }, (_, i) => i + 1).filter(
        (p) => !prev.selectedPages.includes(p)
      ),
    }));
  }, []);

  const setCustomRanges = useCallback((customRanges: string, totalPages?: number) => {
    setOptions((prev) => {
      const res = computeCustomRangesUpdate(prev, customRanges, totalPages);
      if (res.sectionCount !== undefined) {
        setSelectedSectionIndices(Array.from({ length: res.sectionCount }, (_, i) => i));
      }
      return res.options;
    });
  }, []);

  const toggleSplitPoint = useCallback((pageNumber: number, totalPages: number) => {
    if (pageNumber >= totalPages || pageNumber < 1) return;
    setOptions((prev) => {
      const res = computeToggleSplitPoint(prev, pageNumber, totalPages);
      setSelectedSectionIndices(Array.from({ length: res.sectionCount }, (_, i) => i));
      return res.options;
    });
  }, []);

  const clearSplitPoints = useCallback((totalPages: number) => {
    setOptions((prev) => ({
      ...prev,
      splitPoints: [],
      customRanges: `1:${totalPages}`,
      parsedRanges: [{ start: 1, end: totalPages }],
    }));
    setSelectedSectionIndices([0]);
  }, []);

  const toggleSectionIndex = useCallback((idx: number) => {
    setSelectedSectionIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort((a, b) => a - b)
    );
  }, []);

  const selectAllSections = useCallback((total: number) => {
    setSelectedSectionIndices(Array.from({ length: total }, (_, i) => i));
  }, []);

  const deselectAllSections = useCallback(() => {
    setSelectedSectionIndices([]);
  }, []);

  const setEveryN = useCallback((everyN: number) => setOptions((prev) => ({ ...prev, everyN })), []);
  const setMergeExtracted = useCallback((mergeExtracted: boolean) => setOptions((prev) => ({ ...prev, mergeExtracted })), []);
  const setFilenamePrefix = useCallback((filenamePrefix: string) => setOptions((prev) => ({ ...prev, filenamePrefix })), []);

  const executeSplit = useCallback(
    async (
      sourceBuffer: ArrayBuffer,
      totalPages: number,
      pageOrderMapping?: number[],
      pageRotations?: { [originalIndex: number]: number }
    ) => {
      setProgress({ status: 'processing', current: 0, total: 100, message: 'Initializing split...' });
      try {
        const output = await splitPdf(
          sourceBuffer,
          options,
          totalPages,
          (current, total, message) => {
            setProgress({ status: current === total ? 'completed' : 'processing', current, total, message });
          },
          pageOrderMapping,
          pageRotations,
          options.mode === 'range' ? selectedSectionIndices : undefined
        );
        setResult(output);
        return output;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Split process failed';
        setProgress({ status: 'error', current: 0, total: 100, message: msg, error: msg });
        return null;
      }
    },
    [options, selectedSectionIndices]
  );

  const downloadResult = useCallback(() => {
    if (!result) return;
    saveAs(result.blob, result.filename);
  }, [result]);

  const resetSplit = useCallback(() => {
    setResult(null);
    setProgress({ status: 'idle', current: 0, total: 100, message: '' });
  }, []);

  const isProcessing = useMemo(() => progress.status === 'processing', [progress.status]);

  return {
    options,
    progress,
    result,
    isProcessing,
    selectedSectionIndices,
    setMode,
    togglePage,
    selectAll,
    deselectAll,
    invertSelection,
    toggleSplitPoint,
    clearSplitPoints,
    setCustomRanges,
    toggleSectionIndex,
    selectAllSections,
    deselectAllSections,
    setEveryN,
    setMergeExtracted,
    setFilenamePrefix,
    executeSplit,
    downloadResult,
    resetSplit,
  };
}
