import React, { useEffect, useState } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfReduce } from '../features/reduce/usePdfReduce';
import { ReduceHeader } from '../features/reduce/ReduceHeader';
import { ReduceSliders } from '../features/reduce/ReduceSliders';
import { ColorAdjustmentSliders } from '../features/reduce/ColorAdjustmentSliders';
import { ExpandablePreviewCard } from '../features/reduce/ExpandablePreviewCard';
import { ReducePreviewModal } from '../features/reduce/ReducePreviewModal';
import { ReduceCompletionCard } from '../features/reduce/ReduceCompletionCard';
import { ReduceActionButton } from '../features/reduce/ReduceActionButton';
import { Dropzone } from '../components/common/Dropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { renderPageThumbnail, getPdfPageCount } from '../services/pdfRenderer';
import { FileText } from 'lucide-react';

export const ReducePdfPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
  const [activeFile, setActiveFile] = useState<File | null>(sharedFile);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [firstPageThumb, setFirstPageThumb] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const {
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
  } = usePdfReduce(activeFile ? activeFile.size : 0);

  useEffect(() => {
    if (activeFile) {
      resetTargetSize(activeFile.size);
      activeFile.arrayBuffer().then((buf) => {
        setFileBuffer(buf);
        renderPageThumbnail(buf, 1, 240)
          .then(setFirstPageThumb)
          .catch(() => setFirstPageThumb(null));
        getPdfPageCount(buf)
          .then(setTotalPages)
          .catch(() => setTotalPages(1));
      });
    } else {
      setFirstPageThumb(null);
      setTotalPages(1);
    }
  }, [activeFile, resetTargetSize]);

  const handleReset = () => {
    setActiveFile(null);
    setFileBuffer(null);
    setFirstPageThumb(null);
    clearSharedFile();
  };

  const actualMb = activeFile ? activeFile.size / (1024 * 1024) : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      <ReduceHeader
        hasActiveFile={Boolean(activeFile)}
        isProcessing={isProcessing}
        onReset={handleReset}
      />

      {!activeFile && (
        <div className="py-8">
          <Dropzone
            multiple={false}
            title="Drop PDF to Reduce Size"
            subtitle="In-memory client-side compression & color enhancements."
            onFilesSelected={(f) => f.length > 0 && setActiveFile(f[0])}
          />
        </div>
      )}

      {activeFile && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between rounded border border-border bg-bg-surface p-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-text-main truncate">{activeFile.name}</span>
                <span className="text-[11px] text-text-muted">Current Size: <strong>{actualMb.toFixed(2)} MB</strong> • {totalPages} Pages</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary bg-sky-50 px-2.5 py-1 rounded border border-sky-200 shrink-0">
              Ready to Compress
            </span>
          </div>

          <ReduceSliders
            qualityPercent={qualityPercent}
            targetMb={targetMb}
            actualSizeMb={actualMb}
            disabled={isProcessing}
            onQualityChange={setQualityPercent}
            onTargetMbChange={setTargetMb}
          />

          <ColorAdjustmentSliders
            visuals={visuals}
            disabled={isProcessing}
            onUpdateVisual={updateVisual}
            onApplyPreset={updateColorFilters}
          />

          {/* Expandable Preview Card just below Color Enhancement Card */}
          <ExpandablePreviewCard
            thumbnailUrl={firstPageThumb}
            visuals={visuals}
            totalPages={totalPages}
            onExpand={() => setIsPreviewOpen(true)}
          />

          <ReducePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            fileBuffer={fileBuffer}
            totalPages={totalPages}
            visuals={visuals}
            isProcessing={isProcessing}
            hasResult={Boolean(result)}
            onDownloadOrReduce={() => {
              if (result) {
                downloadResult(activeFile.name);
              } else if (fileBuffer) {
                executeReduce(fileBuffer, activeFile.size);
              }
            }}
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
            grayscalePercent={visuals.grayscalePercent}
            isProcessing={isProcessing}
            progress={progress}
            disabled={isProcessing || !fileBuffer}
            onExecute={() => fileBuffer && executeReduce(fileBuffer, activeFile.size)}
          />
        </div>
      )}
    </div>
  );
};
