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
  const [grayscalePercent, setGrayscalePercent] = useState<number>(0);
  const [brightnessPercent, setBrightnessPercent] = useState<number>(100);
  const [contrastPercent, setContrastPercent] = useState<number>(100);
  const [saturationPercent, setSaturationPercent] = useState<number>(100);

  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    current: 0,
    total: 100,
    message: '',
  });

  const [result, setResult] = useState<ReduceResult | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [lastQuality, setLastQuality] = useState<number | null>(null);
  const [lastMb, setLastMb] = useState<number | null>(null);
  const [lastGray, setLastGray] = useState<number | null>(null);
  const [lastBright, setLastBright] = useState<number | null>(null);
  const [lastContrast, setLastContrast] = useState<number | null>(null);
  const [lastSat, setLastSat] = useState<number | null>(null);

  const resetTargetSize = useCallback((sizeBytes: number) => {
    const mb = Math.max(0.1, Math.round((sizeBytes / (1024 * 1024)) * 100) / 100);
    setTargetMb(Math.max(0.05, Math.round(mb * 0.65 * 100) / 100));
    setQualityPercent(65);
    setGrayscalePercent(0);
    setBrightnessPercent(100);
    setContrastPercent(100);
    setSaturationPercent(100);
    setResult(null);
    setHasDownloaded(false);
    setLastQuality(null);
    setLastMb(null);
    setLastGray(null);
    setLastBright(null);
    setLastContrast(null);
    setLastSat(null);
  }, []);

  const updateColorFilters = useCallback(
    (opts: { grayscale?: number; brightness?: number; contrast?: number; saturation?: number }) => {
      if (opts.grayscale !== undefined) setGrayscalePercent(opts.grayscale);
      if (opts.brightness !== undefined) setBrightnessPercent(opts.brightness);
      if (opts.contrast !== undefined) setContrastPercent(opts.contrast);
      if (opts.saturation !== undefined) setSaturationPercent(opts.saturation);
    },
    []
  );

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
          grayscalePercent,
          brightnessPercent,
          contrastPercent,
          saturationPercent,
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
        setLastQuality(qualityPercent);
        setLastMb(targetMb);
        setLastGray(grayscalePercent);
        setLastBright(brightnessPercent);
        setLastContrast(contrastPercent);
        setLastSat(saturationPercent);
        setHasDownloaded(false);
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
    [qualityPercent, targetMb, grayscalePercent, brightnessPercent, contrastPercent, saturationPercent]
  );

  const downloadResult = useCallback(
    (originalFilename: string = 'document.pdf') => {
      if (!result) return;
      const base = originalFilename.replace(/\.pdf$/i, '');
      const downloadName = `${base}_reduced.pdf`;
      saveAs(result.blob, downloadName);
      setHasDownloaded(true);
    },
    [result]
  );

  const isSettingsAltered = useMemo(() => {
    if (!result || lastQuality === null || lastMb === null) return false;
    return (
      qualityPercent !== lastQuality ||
      Math.abs(targetMb - lastMb) > 0.01 ||
      grayscalePercent !== lastGray ||
      brightnessPercent !== lastBright ||
      contrastPercent !== lastContrast ||
      saturationPercent !== lastSat
    );
  }, [
    result,
    qualityPercent,
    targetMb,
    grayscalePercent,
    brightnessPercent,
    contrastPercent,
    saturationPercent,
    lastQuality,
    lastMb,
    lastGray,
    lastBright,
    lastContrast,
    lastSat,
  ]);

  const isProcessing = useMemo(() => {
    return progress.status === 'processing';
  }, [progress.status]);

  return {
    qualityPercent,
    targetMb,
    grayscalePercent,
    brightnessPercent,
    contrastPercent,
    saturationPercent,
    progress,
    result,
    isProcessing,
    hasDownloaded,
    isSettingsAltered,
    setQualityPercent,
    setTargetMb,
    setGrayscalePercent,
    setBrightnessPercent,
    setContrastPercent,
    setSaturationPercent,
    updateColorFilters,
    resetTargetSize,
    executeReduce,
    downloadResult,
  };
}
