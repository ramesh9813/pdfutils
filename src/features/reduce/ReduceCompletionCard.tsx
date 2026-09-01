import React from 'react';
import type { ReduceResult } from './reduceEngine';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CheckCircle2, Download, Check, RefreshCw } from 'lucide-react';

export interface ReduceCompletionCardProps {
  result: ReduceResult;
  hasDownloaded: boolean;
  isSettingsAltered: boolean;
  onDownload: () => void;
}

export const ReduceCompletionCard: React.FC<ReduceCompletionCardProps> = ({
  result,
  hasDownloaded,
  isSettingsAltered,
  onDownload,
}) => {
  const origMb = (result.originalSize / (1024 * 1024)).toFixed(2);
  const redMb = (result.reducedSize / (1024 * 1024)).toFixed(2);

  return (
    <Card className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-emerald-50 border border-emerald-300 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
              Reduced! ({result.percentSaved}% Saved)
            </h4>
            {isSettingsAltered && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                <RefreshCw className="h-2.5 w-2.5" />
                Settings changed
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-800">
            {origMb} MB ➔ <strong>{redMb} MB</strong> ({result.pageCount} pp)
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={onDownload}
        leftIcon={hasDownloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
        className={`${
          hasDownloaded
            ? 'bg-slate-700 hover:bg-slate-800 border-slate-700'
            : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
        } w-full sm:w-auto shadow-xs`}
      >
        {hasDownloaded ? 'Downloaded ✓' : `Download (${redMb} MB)`}
      </Button>
    </Card>
  );
};
