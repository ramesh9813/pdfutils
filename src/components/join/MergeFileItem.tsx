import React, { useState } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  RotateCw,
  FileText,
} from 'lucide-react';
import type { MergeItem, JoinPosition } from '../../types/pdf.types';
import { JoinPositionControls } from '../../features/join/JoinPositionControls';

export interface MergeFileItemProps {
  item: MergeItem;
  index: number;
  totalItems: number;
  allItems: MergeItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  onRotate: (id: string) => void;
  onUpdateJoinPosition?: (
    id: string,
    joinPosition: JoinPosition,
    targetDocumentId?: string,
    insertAfterPage?: number
  ) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  disabled?: boolean;
}

export const MergeFileItem: React.FC<MergeFileItemProps> = ({
  item,
  index,
  totalItems,
  allItems,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdateRange,
  onRotate,
  onUpdateJoinPosition,
  onDragStart,
  onDragOver,
  onDrop,
  disabled = false,
}) => {
  const [rangeInput, setRangeInput] = useState(item.pageRange || 'all');
  const [isEditingRange, setIsEditingRange] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRangeBlur = () => {
    setIsEditingRange(false);
    onUpdateRange(item.id, rangeInput.trim() || 'all');
  };

  const otherDocs = allItems.filter((it) => it.id !== item.id);
  const targetDoc = otherDocs.find((d) => d.id === item.targetDocumentId) || otherDocs[0];
  const joinPos = item.joinPosition || 'end';

  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`flex flex-col gap-3 rounded border bg-bg-surface p-3.5 select-none transition-colors ${
        joinPos === 'inside'
          ? 'border-indigo-300 ring-1 ring-indigo-200 bg-indigo-50/15'
          : joinPos === 'beginning'
          ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/15'
          : 'border-border hover:border-text-muted'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-main p-1" title="Drag to reorder">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-xs font-bold text-text-main">
            {index + 1}
          </div>

          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded border border-border bg-bg-subtle flex items-center justify-center">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-6 w-6 text-text-muted" />
            )}
            {item.rotationOffset ? (
              <span className="absolute bottom-0 right-0 bg-primary text-white text-[9px] font-bold px-1 rounded-tl">
                {item.rotationOffset}°
              </span>
            ) : null}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-text-main truncate" title={item.name}>
              {item.name}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-text-muted">
              <span className="font-semibold text-text-main">{item.pageCount} page(s)</span>
              <span>•</span>
              <span>{formatFileSize(item.size)}</span>
              <span>•</span>
              {isEditingRange ? (
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  onBlur={handleRangeBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleRangeBlur()}
                  autoFocus
                  placeholder="all or 1:3"
                  className="w-20 rounded border border-primary px-1 text-[11px] font-mono outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingRange(true)}
                  className="text-primary hover:underline font-mono"
                  title="Click to specify page range (e.g. 1:5 or all)"
                >
                  Range: {item.pageRange || 'all'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
          <button type="button" onClick={() => onRotate(item.id)} disabled={disabled} title="Rotate 90°" className="p-1.5 rounded text-text-sub hover:text-text-main hover:bg-bg-subtle">
            <RotateCw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMoveUp(index)} disabled={disabled || index === 0} title="Move earlier" className="p-1.5 rounded text-text-sub hover:text-text-main hover:bg-bg-subtle disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMoveDown(index)} disabled={disabled || index === totalItems - 1} title="Move later" className="p-1.5 rounded text-text-sub hover:text-text-main hover:bg-bg-subtle disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onRemove(item.id)} disabled={disabled} title="Remove" className="p-1.5 rounded text-danger hover:bg-rose-50">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {index > 0 && otherDocs.length > 0 && onUpdateJoinPosition && (
        <JoinPositionControls
          item={item}
          otherDocs={otherDocs}
          targetDoc={targetDoc}
          onUpdateJoinPosition={onUpdateJoinPosition}
        />
      )}
    </div>
  );
};
