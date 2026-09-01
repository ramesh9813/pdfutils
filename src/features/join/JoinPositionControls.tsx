import React from 'react';
import type { MergeItem, JoinPosition } from '../../types/pdf.types';
import { Split } from 'lucide-react';

export interface JoinPositionControlsProps {
  item: MergeItem;
  otherDocs: MergeItem[];
  targetDoc?: MergeItem;
  onUpdateJoinPosition: (
    id: string,
    joinPosition: JoinPosition,
    targetDocumentId?: string,
    insertAfterPage?: number
  ) => void;
}

export const JoinPositionControls: React.FC<JoinPositionControlsProps> = ({
  item,
  otherDocs,
  targetDoc,
  onUpdateJoinPosition,
}) => {
  const joinPos = item.joinPosition || 'end';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-2 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-text-sub text-[11px]">Position:</span>
        <div className="inline-flex rounded border border-border bg-bg-subtle p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => onUpdateJoinPosition(item.id, 'end')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              joinPos === 'end' ? 'bg-bg-surface text-text-main shadow-xs font-semibold' : 'text-text-muted hover:text-text-main'
            }`}
          >
            End
          </button>
          <button
            type="button"
            onClick={() => onUpdateJoinPosition(item.id, 'beginning')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              joinPos === 'beginning' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => onUpdateJoinPosition(item.id, 'inside', targetDoc?.id, item.insertAfterPage || 1)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              joinPos === 'inside' ? 'bg-indigo-600 text-white shadow-xs font-semibold' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Inside
          </button>
        </div>
      </div>

      {joinPos === 'inside' && targetDoc && (
        <div className="flex flex-wrap items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px] text-indigo-900 animate-fadeIn">
          <Split className="h-3 w-3 text-indigo-600 shrink-0" />
          <span>Inside:</span>
          <select
            value={targetDoc.id}
            onChange={(e) => onUpdateJoinPosition(item.id, 'inside', e.target.value, item.insertAfterPage || 1)}
            className="rounded border border-indigo-300 bg-white px-1 py-0.5 text-[11px] font-medium outline-none max-w-[120px] truncate"
          >
            {otherDocs.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name} ({doc.pageCount} pp)</option>
            ))}
          </select>
          <span>after p.</span>
          <input
            type="number"
            min="1"
            max={targetDoc.pageCount}
            value={item.insertAfterPage || 1}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                onUpdateJoinPosition(item.id, 'inside', targetDoc.id, Math.max(1, Math.min(val, targetDoc.pageCount)));
              }
            }}
            className="w-14 rounded border border-indigo-300 bg-white px-1.5 py-0.5 text-[11px] font-mono font-bold text-center outline-none"
          />
          <span className="text-[10px] text-indigo-700 font-mono">/ {targetDoc.pageCount}</span>
        </div>
      )}
    </div>
  );
};
