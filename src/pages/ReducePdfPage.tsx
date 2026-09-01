import React, { useEffect, useState } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfReduce } from '../features/reduce/usePdfReduce';
import { ReduceSliders } from '../features/reduce/ReduceSliders';
import { ColorAdjustmentSliders } from '../features/reduce/ColorAdjustmentSliders';
import { LiveFilterPreview } from '../features/reduce/LiveFilterPreview';
import { ReduceCompletionCard } from '../features/reduce/ReduceCompletionCard';
import { ReduceActionButton } from '../features/reduce/ReduceActionButton';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { renderPageThumbnail } from '../services/pdfRenderer';
import { FileText, Minimize2, RotateCcw } from 'lucide-react';

export const ReducePdfPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
  const [activeFile, setActiveFile] = useState<File | null>(sharedFile);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [firstPageThumb, setFirstPageThumb] = useState<string | null>(null);

  const {
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
  } = usePdfReduce(activeFile ? activeFile.size : 0);

  useEffect(() => {
    if (activeFile) {
      resetTargetSize(activeFile.size);
      activeFile.arrayBuffer().then((buf) => {
        setFileBuffer(buf);
        renderPageThumbnail(buf, 1, 240)
          .then(setFirstPageThumb)
          .catch(() => setFirstPageThumb(null));
      });
    } else {
      setFirstPageThumb(null);
    }
  }, [activeFile, resetTargetSize]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) setActiveFile(files[0]);
  };

  const handleExecute = () => {
    if (!fileBuffer || !activeFile) return;
    executeReduce(fileBuffer, activeFile.size);
  };

  const handleReset = () => {
    setActiveFile(null);
    setFileBuffer(null);
    setFirstPageThumb(null);
    clearSharedFile();
  };

  const actualMb = activeFile ? activeFile.size / (1024 * 1024) : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Minimize2 className="h-6 w-6 text-primary" />
            Reduce PDF Size & Enhance
          </h1>
          <p className="text-xs text-text-sub mt-0.5">
            Compress MB size, convert to black & white, or tune brightness & contrast.
          </p>
        </div>

        {activeFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isProcessing}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            New PDF
          </Button>
        )}
      </div>

      {!activeFile && (
        <div className="py-8">
          <Dropzone
            multiple={false}
            title="Drop PDF to Reduce Size"
            subtitle="In-memory client-side compression & color enhancements."
            onFilesSelected={handleFilesSelected}
          />
        </div>
      )}

      {activeFile && (
        <div className="flex flex-col gap-5">
          {/* File summary banner */}
          <div className="flex items-center justify-between rounded border border-border bg-bg-surface p-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-text-main truncate">{activeFile.name}</span>
                <span className="text-[11px] text-text-muted">Current Size: <strong>{actualMb.toFixed(2)} MB</strong></span>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary bg-sky-50 px-2.5 py-1 rounded border border-sky-200 shrink-0">
              Ready to Compress
            </span>
          </div>

          {/* Real-time Filter Preview */}
          <LiveFilterPreview
            thumbnailUrl={firstPageThumb}
            grayscalePercent={grayscalePercent}
            brightnessPercent={brightnessPercent}
            contrastPercent={contrastPercent}
            saturationPercent={saturationPercent}
          />

          {/* Size & Quality Sliders */}
          <ReduceSliders
            qualityPercent={qualityPercent}
            targetMb={targetMb}
            actualSizeMb={actualMb}
            disabled={isProcessing}
            onQualityChange={setQualityPercent}
            onTargetMbChange={setTargetMb}
          />

          {/* Visual & Color Adjustment Sliders */}
          <ColorAdjustmentSliders
            grayscalePercent={grayscalePercent}
            brightnessPercent={brightnessPercent}
            contrastPercent={contrastPercent}
            saturationPercent={saturationPercent}
            disabled={isProcessing}
            onGrayscaleChange={setGrayscalePercent}
            onBrightnessChange={setBrightnessPercent}
            onContrastChange={setContrastPercent}
            onSaturationChange={setSaturationPercent}
            onApplyPreset={updateColorFilters}
          />

          {progress.status !== 'idle' && <ProgressBar progress={progress} />}

          {result && (
            <ReduceCompletionCard
              result={result}
              hasDownloaded={hasDownloaded}
              isSettingsAltered={isSettingsAltered}
              onDownload={() => downloadResult(activeFile.name)}
            />
          )}

          <ReduceActionButton
            result={result}
            isSettingsAltered={isSettingsAltered}
            qualityPercent={qualityPercent}
            targetMb={targetMb}
            grayscalePercent={grayscalePercent}
            isProcessing={isProcessing}
            progress={progress}
            disabled={isProcessing || !fileBuffer}
            onExecute={handleExecute}
          />
        </div>
      )}
    </div>
  );
};
