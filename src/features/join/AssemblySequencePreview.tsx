import React from 'react';
import type { MergeSequenceChunk } from './joinAssembly';
import { Card } from '../../components/common/Card';
import { Split, ArrowRight } from 'lucide-react';

export interface AssemblySequencePreviewProps {
  mergePlan: MergeSequenceChunk[];
  totalEstimatedPages: number;
}

export const AssemblySequencePreview: React.FC<AssemblySequencePreviewProps> = ({
  mergePlan,
  totalEstimatedPages,
}) => {
  if (mergePlan.length < 2) return null;

  return (
    <Card className="flex flex-col gap-2 p-3 bg-sky-50/50 border border-sky-200 shadow-xs animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Split className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-xs font-bold text-text-main">
            Sequence Flow:
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-primary bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300">
          {totalEstimatedPages} pp
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
  );
};
