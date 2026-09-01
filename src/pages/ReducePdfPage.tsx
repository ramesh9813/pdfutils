import React, { useEffect, useState } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfReduce } from '../features/reduce/usePdfReduce';
import { ReduceSliders } from '../features/reduce/ReduceSliders';
import { ReduceCompletionCard } from '../features/reduce/ReduceCompletionCard';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  FileText,
  Minimize2,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const ReducePdfPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
  const [activeFile, setActiveFile] = useState<File | null>(sharedFile);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  const {
    qualityPercent,
    targetMb,
    progress,
    result,
    isProcessing,
    hasDownloaded,
    isSettingsAltered,
    setQualityPercent,
    setTargetMb,
    resetTargetSize,
    executeReduce,
    downloadResult,
  } = usePdfReduce(activeFile ? activeFile.size : 0);

  useEffect(() => {
    if (activeFile) {
      resetTargetSize(activeFile.size);
      activeFile.arrayBuffer().then(setFileBuffer);
    }
  }, [activeFile, resetTargetSize]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setActiveFile(files[0]);
    }
  };

  const handleExecute = () => {
    if (!fileBuffer || !activeFile) return;
    executeReduce(fileBuffer, activeFile.size);
  };

  const handleReset = () => {
    setActiveFile(null);
    setFileBuffer(null);
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
            Reduce PDF Size
          </h1>
          <p className="text-xs text-text-sub mt-0.5">
            Compress MB size with quality and target size sliders.
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

      {/* Dropzone if no file */}
      {!activeFile && (
        <div className="py-8">
          <Dropzone
            multiple={false}
            title="Drop PDF to Reduce Size"
            subtitle="In-memory client-side compression."
            onFilesSelected={handleFilesSelected}
          />
        </div>
      )}

      {/* Active File Workspace */}
      {activeFile && (
        <div className="flex flex-col gap-5">
          {/* File summary banner */}
          <div className="flex items-center justify-between rounded border border-border bg-bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">{activeFile.name}</h3>
                <span className="text-xs text-text-muted">
                  Current Size: <strong className="text-text-main">{actualMb.toFixed(2)} MB</strong>
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
              Ready to Compress
            </span>
          </div>

          {/* Sliders Card */}
          <ReduceSliders
            qualityPercent={qualityPercent}
            targetMb={targetMb}
            actualSizeMb={actualMb}
            disabled={isProcessing}
            onQualityChange={setQualityPercent}
            onTargetMbChange={setTargetMb}
          />

          {/* Progress Banner */}
          {progress.status !== 'idle' && <ProgressBar progress={progress} />}

          {/* Completion Card */}
          {result && (
            <ReduceCompletionCard
              result={result}
              hasDownloaded={hasDownloaded}
              isSettingsAltered={isSettingsAltered}
              onDownload={() => downloadResult(activeFile.name)}
            />
          )}

          {/* Action Button: Always available to alter quality and re-reduce */}
          <div className="flex flex-col gap-2">
            {result && isSettingsAltered && (
              <p className="text-xs text-center text-amber-800 font-semibold bg-amber-50 py-1.5 px-3 rounded border border-amber-300 animate-fadeIn">
                Sliders changed to {qualityPercent}% (~{targetMb.toFixed(2)} MB). Click below to apply and download new size.
              </p>
            )}

            <Button
              type="button"
              variant={!result || isSettingsAltered ? 'primary' : 'outline'}
              size="md"
              onClick={handleExecute}
              disabled={isProcessing || !fileBuffer}
              leftIcon={
                isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )
              }
              className="w-full py-2.5 text-xs font-semibold shadow-xs"
            >
              {isProcessing
                ? `Reducing... (${progress.current}%)`
                : !result
                ? `Reduce to ~${targetMb.toFixed(2)} MB (${qualityPercent}%)`
                : isSettingsAltered
                ? `Apply New Quality (~${targetMb.toFixed(2)} MB • ${qualityPercent}%)`
                : `Reduce Again (~${targetMb.toFixed(2)} MB • ${qualityPercent}%)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
