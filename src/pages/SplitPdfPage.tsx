import React, { useEffect, useRef } from 'react';
import { usePdfSession } from '../hooks/usePdfSession';
import { usePdfSplit } from '../hooks/usePdfSplit';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PagePreviewGrid } from '../components/split/PagePreviewGrid';
import { SplitConfigPanel } from '../components/split/SplitConfigPanel';
import {
  FileText,
  Scissors,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

export const SplitPdfPage: React.FC = () => {
  const {
    docInfo,
    pages,
    isLoading: isSessionLoading,
    error: sessionError,
    loadFile,
    getFreshBuffer,
    resetSession,
    rotatePage,
    reorderPages,
    resetPageOrder,
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
    toggleSplitPoint,
    clearSplitPoints,
    setCustomRanges,
    setEveryN,
    setMergeExtracted,
    setFilenamePrefix,
    executeSplit,
    downloadResult,
    resetSplit,
  } = usePdfSplit(docInfo ? docInfo.name : 'document');

  const configPanelRef = useRef<HTMLDivElement>(null);

  // Synchronize filename prefix and default Python slice when docInfo updates
  useEffect(() => {
    if (docInfo) {
      setFilenamePrefix(docInfo.name.replace(/\.pdf$/i, ''));
      if (options.splitPoints.length === 0 && (!options.customRanges || options.customRanges === '1:1')) {
        setCustomRanges(`1:${docInfo.pageCount}`, docInfo.pageCount);
      }
    }
  }, [docInfo, setFilenamePrefix, setCustomRanges, options.splitPoints.length, options.customRanges]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      resetSplit();
      loadFile(files[0]);
    }
  };

  const handleExecuteSplit = () => {
    if (!docInfo) return;
    const freshBuf = getFreshBuffer();
    const pageOrderMapping = pages.map((p) => p.originalPageIndex);
    const pageRotations: { [originalIndex: number]: number } = {};
    pages.forEach((p) => {
      if (p.rotation) {
        pageRotations[p.originalPageIndex] = p.rotation;
      }
    });
    executeSplit(freshBuf, docInfo.pageCount, pageOrderMapping, pageRotations);
  };

  // Toggle split point from page's 3-dot dropdown
  const handleSplitFromHere = (pageNumber: number) => {
    if (!docInfo) return;
    toggleSplitPoint(pageNumber, docInfo.pageCount);
    configPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Extract single page from 3-dot dropdown
  const handleExtractSinglePage = (pageNumber: number) => {
    if (!docInfo) return;
    const baseName = docInfo.name.replace(/\.pdf$/i, '');

    setMode('extract');
    setMergeExtracted(true);
    setFilenamePrefix(`${baseName}_page_${pageNumber}`);
    
    // Select just this page
    deselectAll();
    togglePage(pageNumber);

    configPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            Split PDF Document
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-0.5">
            Configure splitting at top, inspect live page previews below, or split instantly from any page's 3-dot menu.
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

      {/* Error Banner */}
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

      {/* Loading Document State */}
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

      {/* Document Loaded Workspace: SETUP AT TOP, PREVIEW AT BOTTOM */}
      {docInfo && !isSessionLoading && (
        <div className="flex flex-col gap-6">
          {/* Document metadata banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className="text-xs sm:text-sm font-bold text-text-main truncate"
                  title={docInfo.name}
                >
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

          {/* 1. TOP SECTION: Splitting Setup */}
          <div ref={configPanelRef} className="w-full">
            <SplitConfigPanel
              options={options}
              totalPages={docInfo.pageCount}
              isProcessing={isProcessing}
              progress={progress}
              result={result}
              onSetMode={setMode}
              onSetCustomRanges={setCustomRanges}
              onSetEveryN={setEveryN}
              onSetMergeExtracted={setMergeExtracted}
              onSetFilenamePrefix={setFilenamePrefix}
              onExecuteSplit={handleExecuteSplit}
              onDownload={downloadResult}
              onResetSplit={resetSplit}
            />
          </div>

          {/* 2. BOTTOM SECTION: Page Preview Grid */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main">
                  Document Pages Preview ({pages.length})
                </h3>
                <p className="text-xs text-text-muted">
                  Click pages to select/deselect, rotate orientation, or click the 3 dots on any page to split from there.
                </p>
              </div>
            </div>

            <PagePreviewGrid
              pages={pages}
              selectedPages={options.selectedPages}
              splitPoints={options.splitPoints}
              splitMode={options.mode}
              onTogglePage={togglePage}
              onToggleSplitPoint={(p) => docInfo && toggleSplitPoint(p, docInfo.pageCount)}
              onClearSplitPoints={() => docInfo && clearSplitPoints(docInfo.pageCount)}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onInvertSelection={invertSelection}
              onRotatePage={rotatePage}
              onSplitFromHere={handleSplitFromHere}
              onExtractSinglePage={handleExtractSinglePage}
              onReorderPages={reorderPages}
              onResetPageOrder={resetPageOrder}
              disabled={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
};
