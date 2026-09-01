import React, { useEffect, useState } from 'react';
import { useSharedPdf } from '../context/PdfContext';
import { usePdfSession } from '../hooks/usePdfSession';
import { saveReorderedPdf } from '../features/reorder/reorderEngine';
import { ReorderToolbar } from '../features/reorder/ReorderToolbar';
import { PagePreviewGrid } from '../components/split/PagePreviewGrid';
import { Dropzone } from '../components/common/Dropzone';
import { Button } from '../components/common/Button';
import saveAs from 'file-saver';
import {
  RotateCcw,
  ArrowUpDown,
} from 'lucide-react';

export const ReorderPdfPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
  const {
    docInfo,
    pages,
    isLoading,
    loadFile,
    getFreshBuffer,
    resetSession,
    rotatePage,
    reorderPages,
    resetPageOrder,
  } = usePdfSession();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (sharedFile && !docInfo) {
      loadFile(sharedFile);
    }
  }, [sharedFile, docInfo, loadFile]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      loadFile(files[0]);
    }
  };

  const handleReverseOrder = () => {
    const total = pages.length;
    for (let i = 0; i < Math.floor(total / 2); i++) {
      reorderPages(i, total - 1 - i);
    }
  };

  const handleSaveReordered = async () => {
    if (!docInfo) return;
    setIsSaving(true);
    try {
      const buffer = getFreshBuffer();
      const baseName = docInfo.name.replace(/\.pdf$/i, '');
      const { blob, filename } = await saveReorderedPdf(
        buffer,
        pages,
        `${baseName}_reordered.pdf`
      );
      saveAs(blob, filename);
    } catch (err) {
      console.error('Failed to save reordered PDF:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetSession();
    clearSharedFile();
  };

  const isModified = pages.some((p, idx) => p.originalPageIndex !== idx);

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <ArrowUpDown className="h-6 w-6 text-primary" />
            Reorder PDF Pages
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-0.5">
            Hold any page for ~1.2s to pick up and drop at a new position, or use toolbar controls.
          </p>
        </div>

        {docInfo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Upload Different PDF
          </Button>
        )}
      </div>

      {/* Dropzone */}
      {!docInfo && !isLoading && (
        <div className="max-w-2xl mx-auto w-full py-8">
          <Dropzone
            multiple={false}
            title="Drag & Drop PDF File Here to Reorder Pages"
            subtitle="Restructure page order seamlessly in your browser."
            onFilesSelected={handleFilesSelected}
          />
        </div>
      )}

      {/* Active Workspace */}
      {docInfo && (
        <div className="flex flex-col gap-5">
          <ReorderToolbar
            pageCount={pages.length}
            isModified={isModified}
            isProcessing={isSaving}
            onReverse={handleReverseOrder}
            onReset={resetPageOrder}
            onSave={handleSaveReordered}
          />

          <PagePreviewGrid
            pages={pages}
            selectedPages={[]}
            splitPoints={[]}
            splitMode="single"
            onTogglePage={() => {}}
            onToggleSplitPoint={() => {}}
            onClearSplitPoints={() => {}}
            onSelectAll={() => {}}
            onDeselectAll={() => {}}
            onInvertSelection={() => {}}
            onRotatePage={rotatePage}
            onReorderPages={reorderPages}
            onResetPageOrder={resetPageOrder}
            disabled={isSaving}
          />
        </div>
      )}
    </div>
  );
};
