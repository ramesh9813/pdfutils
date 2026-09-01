import React, { useState, useRef, useMemo } from 'react';
import type { MergeItem, MergeOptions, JoinPosition } from '../../types/pdf.types';
import { MergeFileItem } from './MergeFileItem';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Dropzone } from '../common/Dropzone';
import { Plus, Trash2, ArrowRight, Split } from 'lucide-react';
import { buildMergeSequencePlan } from '../../services/pdfMerger';

export interface MergeFileListProps {
  items: MergeItem[];
  options: MergeOptions;
  isProcessing: boolean;
  totalEstimatedPages: number;
  onAddFiles: (files: File[]) => void;
  onRemoveItem: (id: string) => void;
  onClearItems: () => void;
  onMoveItem: (from: number, to: number) => void;
  onUpdateRange: (id: string, range: string) => void;
  onRotateItem: (id: string) => void;
  onUpdateJoinPosition?: (
    id: string,
    joinPosition: JoinPosition,
    targetDocumentId?: string,
    insertAfterPage?: number
  ) => void;
  onSetOutputFilename: (name: string) => void;
  onExecuteMerge: () => void;
}

export const MergeFileList: React.FC<MergeFileListProps> = ({
  items,
  options,
  isProcessing,
  totalEstimatedPages,
  onAddFiles,
  onRemoveItem,
  onClearItems,
  onMoveItem,
  onUpdateRange,
  onRotateItem,
  onUpdateJoinPosition,
  onSetOutputFilename,
  onExecuteMerge,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mergePlan = useMemo(() => {
    try {
      return buildMergeSequencePlan(items);
    } catch {
      return [];
    }
  }, [items]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    onMoveItem(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-4">
        <div>
          <h3 className="text-base font-bold text-text-main">
            Merge Document Queue ({items.length})
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Total estimated pages:{' '}
            <strong className="text-text-main">{totalEstimatedPages}</strong>. Drag items or use arrows to adjust sequence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                onAddFiles(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add More
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearItems}
            disabled={isProcessing || items.length === 0}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* List of files */}
      <div className="flex flex-col gap-2.5">
        {items.map((item, index) => (
          <MergeFileItem
            key={item.id}
            item={item}
            index={index}
            totalItems={items.length}
            allItems={items}
            onMoveUp={(idx) => onMoveItem(idx, idx - 1)}
            onMoveDown={(idx) => onMoveItem(idx, idx + 1)}
            onRemove={onRemoveItem}
            onUpdateRange={onUpdateRange}
            onRotate={onRotateItem}
            onUpdateJoinPosition={onUpdateJoinPosition}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Assembly Sequence Flow Preview Card */}
      {items.length >= 2 && mergePlan.length > 0 && (
        <Card className="flex flex-col gap-3 p-4 bg-sky-50/50 border border-sky-200 shadow-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Split className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-text-main">
                Assembly Flow Preview (Including Middle/Inside Insertions)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-primary bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
              Total {totalEstimatedPages} Pages
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {mergePlan.map((chunk, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ArrowRight className="h-3.5 w-3.5 text-text-muted shrink-0" />}
                <div className="flex items-center gap-1.5 bg-white border border-border rounded px-2.5 py-1.5 shadow-xs text-xs">
                  <span className="font-semibold text-text-main max-w-[130px] truncate" title={chunk.fileName}>
                    {chunk.fileName}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {chunk.pageRangeDisplay}
                  </span>
                  <span className="text-[10px] text-text-muted">({chunk.pageCount} pp)</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      {/* Mini Dropzone at bottom to append more easily */}
      <Dropzone
        multiple
        title="Add more files to queue"
        subtitle="Drag additional PDF documents here to append them to the merge queue."
        onFilesSelected={onAddFiles}
        disabled={isProcessing}
        className="py-4"
      />

      {/* Options & Execution */}
      <Card className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-text-main mb-1 block" htmlFor="merged-name">
            Merged Output File Name:
          </label>
          <input
            id="merged-name"
            type="text"
            value={options.outputFilename}
            onChange={(e) => onSetOutputFilename(e.target.value)}
            placeholder="merged-documents.pdf"
            className="w-full rounded border border-border px-3 py-2 text-xs bg-bg-surface text-text-main outline-none focus:border-primary font-medium"
          />
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onExecuteMerge}
          disabled={items.length < 2 || isProcessing}
          isLoading={isProcessing}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="w-full"
        >
          {isProcessing
            ? 'Merging PDF Documents...'
            : `Merge ${items.length} Documents (${totalEstimatedPages} Pages)`}
        </Button>
      </Card>
    </div>
  );
};
