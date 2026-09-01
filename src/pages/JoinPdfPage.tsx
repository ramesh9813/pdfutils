import React, { useEffect } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfMerge } from '../hooks/usePdfMerge';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { MergeFileList } from '../components/join/MergeFileList';
import {
  Layers,
  Download,
  CheckCircle2,
} from 'lucide-react';

export const JoinPdfPage: React.FC = () => {
  const { sharedFile } = useSharedPdf();
  const {
    items,
    options,
    progress,
    result,
    isProcessing,
    totalEstimatedPages,
    addFiles,
    removeItem,
    clearItems,
    moveItem,
    updatePageRange,
    rotateItem,
    updateJoinPosition,
    setOutputFilename,
    executeMerge,
    downloadResult,
    resetMerge,
  } = usePdfMerge();

  useEffect(() => {
    if (sharedFile && items.length === 0) {
      addFiles([sharedFile]);
    }
  }, [sharedFile, items.length, addFiles]);

  const handleFilesSelected = (files: File[]) => {
    resetMerge();
    addFiles(files);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Merge PDFs
          </h1>
          <p className="text-xs text-text-sub mt-0.5">
            Combine PDFs at start, end, or inside pages.
          </p>
        </div>
      </div>

      {/* Progress or Completion Banner */}
      {progress.status !== 'idle' && (
        <ProgressBar progress={progress} />
      )}

      {/* Completion Download Card */}
      {result && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded border border-primary/30 bg-primary/5 p-3.5 text-text-main">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold">Merged!</h3>
              <p className="text-[11px] text-text-sub">
                {result.totalFiles} files ➔ <strong>{result.totalPages} pages</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={downloadResult}
              leftIcon={<Download className="h-3.5 w-3.5" />}
              className="w-full sm:w-auto"
            >
              Download ({result.totalPages} pp)
            </Button>
          </div>
        </div>
      )}

      {/* Empty State: Initial Dropzone */}
      {items.length === 0 ? (
        <div className="max-w-2xl mx-auto w-full py-8">
          <Dropzone
            multiple
            title="Drop PDFs to Merge"
            subtitle="100% in-browser processing."
            onFilesSelected={handleFilesSelected}
          />
        </div>
      ) : (
        /* Populated Merge Workspace */
        <div className="max-w-4xl mx-auto w-full">
          <MergeFileList
            items={items}
            options={options}
            isProcessing={isProcessing}
            totalEstimatedPages={totalEstimatedPages}
            onAddFiles={addFiles}
            onRemoveItem={removeItem}
            onClearItems={clearItems}
            onMoveItem={moveItem}
            onUpdateRange={updatePageRange}
            onRotateItem={rotateItem}
            onUpdateJoinPosition={updateJoinPosition}
            onSetOutputFilename={setOutputFilename}
            onExecuteMerge={executeMerge}
          />
        </div>
      )}
    </div>
  );
};
