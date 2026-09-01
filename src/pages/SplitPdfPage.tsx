import React, { useEffect } from 'react';
import { usePdfSession } from '../hooks/usePdfSession';
import { usePdfSplit } from '../hooks/usePdfSplit';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { PagePreviewGrid } from '../components/split/PagePreviewGrid';
import { SplitConfigPanel } from '../components/split/SplitConfigPanel';
import {
  FileText,
  Scissors,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const SplitPdfPage: React.FC = () => {
  const {
    docInfo,
    pages,
    isLoading: isSessionLoading,
    error: sessionError,
    loadFile,
    resetSession,
    rotatePage,
  } = usePdfSession();

  const {
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
    executeSplit,
    downloadResult,
    resetSplit,
  } = usePdfSplit(docInfo ? docInfo.name : 'document');

  // Update filename prefix when docInfo changes
  useEffect(() => {
    if (docInfo) {
      setFilenamePrefix(docInfo.name.replace(/\.pdf$/i, ''));
    }
  }, [docInfo, setFilenamePrefix]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      resetSplit();
      loadFile(files[0]);
    }
  };

  const handleExecuteSplit = () => {
    if (!docInfo) return;
    executeSplit(docInfo.arrayBuffer, docInfo.pageCount);
  };

  const handleResetAll = () => {
    resetSplit();
    resetSession();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            Split PDF Document
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-0.5">
            Extract selected pages, slice by custom intervals, or unpack into separate files.
          </p>
        </div>

        {docInfo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            disabled={isProcessing}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Upload Different PDF
          </Button>
        )}
      </div>

      {/* Error Banners */}
      {sessionError && (
        <div className="flex items-center gap-2 rounded border border-danger bg-rose-50 p-3 text-xs text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{sessionError}</span>
        </div>
      )}

      {/* No PDF loaded state */}
      {!docInfo && !isSessionLoading && (
        <div className="max-w-2xl mx-auto w-full py-8">
          <Dropzone
            onFilesSelected={handleFilesSelected}
            multiple={false}
            title="Drag & Drop PDF File Here to Split"
            subtitle="Secure client-side processing. File sizes up to 500MB+ supported without uploading to any server."
          />
        </div>
      )}

      {/* Loading Document Initializing State */}
      {isSessionLoading && (
        <Card className="flex flex-col items-center justify-center p-12 text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
            <FileText className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-text-main">
            Loading & Parsing PDF Document...
          </span>
          <p className="text-xs text-text-muted">
            Generating high-fidelity page preview thumbnails in the background.
          </p>
        </Card>
      )}

      {/* Document Loaded Workspace */}
      {docInfo && !isSessionLoading && (
        <div className="flex flex-col gap-6">
          {/* Document metadata banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-text-main truncate" title={docInfo.name}>
                  {docInfo.name}
                </span>
                <span className="text-[11px] text-text-muted">
                  {docInfo.pageCount} Pages • {formatFileSize(docInfo.size)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-sub font-mono bg-bg-subtle px-2.5 py-1 rounded border border-border">
                {options.selectedPages.length} of {docInfo.pageCount} pages selected
              </span>
            </div>
          </div>

          {/* Progress or Completion Banner */}
          {progress.status !== 'idle' && (
            <ProgressBar progress={progress} />
          )}

          {/* Completion Download Card */}
          {result && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Split Processing Completed!</h3>
                  <p className="text-xs text-emerald-800">
                    Generated <strong>{result.fileCount}</strong> file(s) ({result.isZip ? 'ZIP Archive' : 'PDF Document'}). Ready for immediate local download.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={downloadResult}
                  leftIcon={<Download className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Download {result.filename}
                </Button>
              </div>
            </div>
          )}

          {/* 2-Column Split Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Preview Grid */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <PagePreviewGrid
                pages={pages}
                selectedPages={options.selectedPages}
                onTogglePage={togglePage}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onInvertSelection={invertSelection}
                onRotatePage={rotatePage}
                disabled={isProcessing}
              />
            </div>

            {/* Right: Configuration Panel */}
            <div className="lg:col-span-4 sticky top-20">
              <SplitConfigPanel
                options={options}
                totalPages={docInfo.pageCount}
                isProcessing={isProcessing}
                onSetMode={setMode}
                onSetCustomRanges={setCustomRanges}
                onSetEveryN={setEveryN}
                onSetMergeExtracted={setMergeExtracted}
                onSetFilenamePrefix={setFilenamePrefix}
                onExecuteSplit={handleExecuteSplit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
