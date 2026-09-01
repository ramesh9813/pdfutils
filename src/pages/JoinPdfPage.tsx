import React from 'react';
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
    setOutputFilename,
    executeMerge,
    downloadResult,
    resetMerge,
  } = usePdfMerge();

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
            Merge PDF Documents
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-0.5">
            Combine multiple PDF files into one clean, continuous document in your chosen order.
          </p>
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
              <h3 className="text-sm font-bold">Merge Completed Successfully!</h3>
              <p className="text-xs text-emerald-800">
                Merged <strong>{result.totalFiles}</strong> documents into a single document containing{' '}
                <strong>{result.totalPages}</strong> pages.
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
              Download Merged PDF
            </Button>
          </div>
        </div>
      )}

      {/* Empty State: Initial Dropzone */}
      {items.length === 0 ? (
        <div className="max-w-2xl mx-auto w-full py-8">
          <Dropzone
            multiple
            title="Drag & Drop PDF Files Here to Merge"
            subtitle="Select two or more PDF documents. Files are processed 100% locally in your browser memory."
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
            onSetOutputFilename={setOutputFilename}
            onExecuteMerge={executeMerge}
          />
        </div>
      )}
    </div>
  );
};
