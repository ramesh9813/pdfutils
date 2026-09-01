import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type { ProgressState } from '../../types/pdf.types';
import { reducePdfSize, type ReduceResult, type ReduceOptions } from './reduceEngine';

export function usePdfReduce(initialFileSize: number = 0) {
  const initialMb = Math.max(0.1, Math.round((initialFileSize / (1024 * 1024)) * 100) / 100);

  const [qualityPercent, setQualityPercent] = useState<number>(65);
  const [targetMb, setTargetMb] = useState<number>(
    Math.max(0.05, Math.round(initialMb * 0.65 * 100) / 100)
  );

  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    current: 0,
    total: 100,
    message: '',
  });

  const [result, setResult] = useState<ReduceResult | null>(null);

  const resetTargetSize = useCallback((sizeBytes: number) => {
    const mb = Math.max(0.1, Math.round((sizeBytes / (1024 * 1024)) * 100) / 100);
    setTargetMb(Math.max(0.05, Math.round(mb * 0.65 * 100) / 100));
    setQualityPercent(65);
    setResult(null);
  }, []);

  const executeReduce = useCallback(
    async (sourceBuffer: ArrayBuffer, fileSize: number) => {
      setProgress({
        status: 'processing',
        current: 0,
        total: 100,
        message: 'Starting reduction engine...',
      });

      try {
        const options: ReduceOptions = {
          qualityPercent,
          targetMb,
          originalSize: fileSize,
        };

        const out = await reducePdfSize(sourceBuffer, options, (percent, message) => {
          setProgress({
            status: percent === 100 ? 'completed' : 'processing',
            current: percent,
            total: 100,
            message,
          });
        });

        setResult(out);
        return out;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'PDF reduction failed';
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
    [qualityPercent, targetMb]
  );

  const downloadResult = useCallback(
    (originalFilename: string = 'document.pdf') => {
      if (!result) return;
      const base = originalFilename.replace(/\.pdf$/i, '');
      const downloadName = `${base}_reduced.pdf`;
      saveAs(result.blob, downloadName);
    },
    [result]
  );

  const isProcessing = useMemo(() => {
    return progress.status === 'processing';
  }, [progress.status]);

  return {
    qualityPercent,
    targetMb,
    progress,
    result,
    isProcessing,
    setQualityPercent,
    setTargetMb,
    resetTargetSize,
    executeReduce,
    downloadResult,
  };
}
