import React, { useEffect, useState } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfReduce } from '../features/reduce/usePdfReduce';
import { ReduceSliders } from '../features/reduce/ReduceSliders';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  FileText,
  Minimize2,
  Download,
  RotateCcw,
  CheckCircle2,
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
            Reduce PDF File Size
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-0.5">
            Optimize and reduce PDF size by adjusting visual quality percentage and target MB limit.
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
            Upload Different PDF
          </Button>
        )}
      </div>

      {/* Dropzone if no file */}
      {!activeFile && (
        <div className="py-8">
          <Dropzone
            multiple={false}
            title="Drag & Drop PDF File Here to Reduce Size"
            subtitle="Client-side optimization. Images and pages are compressed in-browser memory."
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
            <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-emerald-50 border border-emerald-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    PDF Reduced Successfully! ({result.percentSaved}% Saved)
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Original: {(result.originalSize / (1024 * 1024)).toFixed(2)} MB ➔ Reduced:{' '}
                    <strong>{(result.reducedSize / (1024 * 1024)).toFixed(2)} MB</strong> across{' '}
                    {result.pageCount} page(s).
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => downloadResult(activeFile.name)}
                leftIcon={<Download className="h-4 w-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 w-full sm:w-auto"
              >
                Download Reduced PDF
              </Button>
            </Card>
          )}

          {/* Action Button */}
          {!result && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleExecute}
              disabled={isProcessing || !fileBuffer}
              leftIcon={
                isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )
              }
              className="w-full py-3 text-base font-semibold"
            >
              {isProcessing
                ? `Reducing PDF Size... (${progress.current}%)`
                : `Reduce Size to ~${targetMb.toFixed(2)} MB (${qualityPercent}% Quality)`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
