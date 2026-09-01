import { useState, useCallback, useMemo } from 'react';
import saveAs from 'file-saver';
import type { ProgressState } from '../../types/pdf.types';
import {
  reducePdfSize,
  type ReduceResult,
  type ReduceOptions,
  type ColorAdjustmentOptions,
} from './reduceEngine';

const defaultVisuals: ColorAdjustmentOptions = {
  grayscalePercent: 0,
  brightnessPercent: 100,
  contrastPercent: 100,
  saturationPercent: 100,
  sharpnessPercent: 0,
  colorBoostPercent: 0,
  textWeightPercent: 0,
};

import { useSettings } from '../../context/SettingsContext';

export function usePdfReduce(initialFileSize: number = 0) {
  const { settings } = useSettings();
  const initQuality = settings.reduce.defaultQuality ?? 65;
  const initGrayscale = settings.reduce.defaultBw ? 100 : 0;
  const initSharpness = settings.reduce.defaultSharpness ?? 0;
  const initTextWeight = settings.reduce.defaultTextWeight ?? 0;

  const initialMb = Math.max(0.1, Math.round((initialFileSize / (1024 * 1024)) * 100) / 100);

  const [qualityPercent, setQualityPercent] = useState<number>(initQuality);
  const [targetMb, setTargetMb] = useState<number>(
    Math.max(0.05, Math.round(initialMb * (initQuality / 100) * 100) / 100)
  );

  const [visuals, setVisuals] = useState<ColorAdjustmentOptions>({
    ...defaultVisuals,
    grayscalePercent: initGrayscale,
    sharpnessPercent: initSharpness,
    textWeightPercent: initTextWeight,
  });

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
  const [lastVisuals, setLastVisuals] = useState<ColorAdjustmentOptions | null>(null);

  const resetTargetSize = useCallback((sizeBytes: number) => {
    const mb = Math.max(0.1, Math.round((sizeBytes / (1024 * 1024)) * 100) / 100);
    const q = settings.reduce.defaultQuality ?? 65;
    setTargetMb(Math.max(0.05, Math.round(mb * (q / 100) * 100) / 100));
    setQualityPercent(q);
    setVisuals({
      ...defaultVisuals,
      grayscalePercent: settings.reduce.defaultBw ? 100 : 0,
      sharpnessPercent: settings.reduce.defaultSharpness ?? 0,
      textWeightPercent: settings.reduce.defaultTextWeight ?? 0,
    });
    setResult(null);
    setHasDownloaded(false);
    setLastQuality(null);
    setLastMb(null);
    setLastVisuals(null);
  }, [settings.reduce]);

  const updateVisual = useCallback((key: keyof ColorAdjustmentOptions, val: number) => {
    setVisuals((prev) => ({ ...prev, [key]: val }));
  }, []);

  const updateColorFilters = useCallback((patch: Partial<ColorAdjustmentOptions>) => {
    setVisuals((prev) => ({ ...prev, ...patch }));
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
          ...visuals,
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
        setLastVisuals({ ...visuals });
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
    [qualityPercent, targetMb, visuals]
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
    if (!result || lastQuality === null || lastMb === null || !lastVisuals) return false;
    const baseChanged = qualityPercent !== lastQuality || Math.abs(targetMb - lastMb) > 0.01;
    const visualsChanged = Object.keys(visuals).some(
      (k) => visuals[k as keyof ColorAdjustmentOptions] !== lastVisuals[k as keyof ColorAdjustmentOptions]
    );
    return baseChanged || visualsChanged;
  }, [result, qualityPercent, targetMb, visuals, lastQuality, lastMb, lastVisuals]);

  const isProcessing = useMemo(() => {
    return progress.status === 'processing';
  }, [progress.status]);

  return {
    qualityPercent,
    targetMb,
    visuals,
    progress,
    result,
    isProcessing,
    hasDownloaded,
    isSettingsAltered,
    setQualityPercent,
    setTargetMb,
    updateVisual,
    updateColorFilters,
    resetTargetSize,
    executeReduce,
    downloadResult,
  };
}
