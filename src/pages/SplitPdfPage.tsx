import React, { useEffect, useRef } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfSession } from '../hooks/usePdfSession';
import { usePdfSplit } from '../hooks/usePdfSplit';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { PagePreviewGrid } from '../components/split/PagePreviewGrid';
import { SplitConfigPanel } from '../components/split/SplitConfigPanel';
import { FileText, Scissors, RotateCcw, AlertCircle } from 'lucide-react';

export const SplitPdfPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
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
  } = usePdfSplit(docInfo ? docInfo.name : 'document');

  const configPanelRef = useRef<HTMLDivElement>(null);

  // Pick up shared file from utils top card if available
  useEffect(() => {
    if (sharedFile && !docInfo) {
      loadFile(sharedFile);
    }
  }, [sharedFile, docInfo, loadFile]);

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
      if (p.rotation) pageRotations[p.originalPageIndex] = p.rotation;
    });
    executeSplit(freshBuf, docInfo.pageCount, pageOrderMapping, pageRotations);
  };

  const handleResetAll = () => {
    resetSplit();
    resetSession();
    clearSharedFile();
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            Split PDF
          </h1>
          <p className="text-xs text-text-sub mt-0.5">
            Configure split at top; double-click pages below to cut.
          </p>
        </div>

        {docInfo && (
          <Button type="button" variant="outline" size="sm" onClick={handleResetAll} disabled={isProcessing} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            New PDF
          </Button>
        )}
      </div>

      {sessionError && (
        <div className="flex items-center gap-2 rounded border border-danger bg-rose-50 p-3 text-xs text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{sessionError}</span>
        </div>
      )}

      {!docInfo && !isSessionLoading && (
        <div className="max-w-2xl mx-auto w-full py-8">
          <Dropzone
            onFilesSelected={handleFilesSelected}
            multiple={false}
            title="Drop PDF to Split"
            subtitle="100% private in-memory processing."
          />
        </div>
      )}

      {docInfo && !isSessionLoading && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-text-main truncate">{docInfo.name}</span>
                <span className="text-[11px] text-text-muted">{docInfo.pageCount} Pages • {(docInfo.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          </div>

          <div ref={configPanelRef} className="w-full">
            <SplitConfigPanel
              options={options}
              totalPages={docInfo.pageCount}
              isProcessing={isProcessing}
              progress={progress}
              result={result}
              selectedSectionIndices={selectedSectionIndices}
              onSetMode={setMode}
              onSetCustomRanges={setCustomRanges}
              onSetEveryN={setEveryN}
              onSetMergeExtracted={setMergeExtracted}
              onSetFilenamePrefix={setFilenamePrefix}
              onToggleSectionIndex={toggleSectionIndex}
              onSelectAllSections={selectAllSections}
              onDeselectAllSections={deselectAllSections}
              onExecuteSplit={handleExecuteSplit}
              onDownload={downloadResult}
              onResetSplit={resetSplit}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <h3 className="text-sm font-bold text-text-main">
              Page Previews ({pages.length})
            </h3>
            <PagePreviewGrid
              pages={pages}
              selectedPages={options.selectedPages}
              splitPoints={options.splitPoints}
              splitMode={options.mode}
              sourceBuffer={getFreshBuffer()}
              baseDocName={docInfo.name}
              onTogglePage={togglePage}
              onToggleSplitPoint={(p) => toggleSplitPoint(p, docInfo.pageCount)}
              onClearSplitPoints={() => clearSplitPoints(docInfo.pageCount)}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onInvertSelection={invertSelection}
              onRotatePage={rotatePage}
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
