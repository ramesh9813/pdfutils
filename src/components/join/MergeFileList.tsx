import React, { useState, useRef, useMemo } from 'react';
import type { MergeItem, MergeOptions, JoinPosition } from '../../types/pdf.types';
import { MergeFileItem } from './MergeFileItem';
import { AssemblySequencePreview } from '../../features/join/AssemblySequencePreview';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Dropzone } from '../common/Dropzone';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
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

  const handleDragOver = (e: React.DragEvent) => {
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-bg-surface p-3 sm:px-4">
        <div>
          <h3 className="text-sm font-bold text-text-main">
            Queue ({items.length})
          </h3>
          <p className="text-xs text-text-muted">
            {totalEstimatedPages} pages estimated. Drag to reorder.
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
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isProcessing} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add Files
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClearItems} disabled={isProcessing || items.length === 0} leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
            Clear
          </Button>
        </div>
      </div>

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

      <AssemblySequencePreview mergePlan={mergePlan} totalEstimatedPages={totalEstimatedPages} />

      <Dropzone
        multiple
        title="Add more PDFs"
        subtitle="Append files to merge queue."
        onFilesSelected={onAddFiles}
        disabled={isProcessing}
        className="py-3"
      />

      <Card className="flex flex-col gap-3 p-4">
        <div>
          <label className="text-xs font-semibold text-text-main mb-1 block" htmlFor="merged-name">
            Output File Name:
          </label>
          <input
            id="merged-name"
            type="text"
            value={options.outputFilename}
            onChange={(e) => onSetOutputFilename(e.target.value)}
            placeholder="merged.pdf"
            className="w-full rounded border border-border px-2.5 py-1.5 text-xs bg-bg-surface text-text-main outline-none focus:border-primary font-mono"
          />
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onExecuteMerge}
          disabled={items.length < 2 || isProcessing}
          isLoading={isProcessing}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="w-full py-2.5 text-xs font-bold"
        >
          {isProcessing
            ? 'Merging...'
            : `Merge ${items.length} Files (${totalEstimatedPages} pp)`}
        </Button>
      </Card>
    </div>
  );
};
