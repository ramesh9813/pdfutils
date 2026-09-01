import React from 'react';
import type { ReduceResult } from './reduceTypes';
import type { ProgressState } from '../../types/pdf.types';
import { Button } from '../../components/common/Button';
import { Loader2, Sparkles } from 'lucide-react';

export interface ReduceActionButtonProps {
  result: ReduceResult | null;
  isSettingsAltered: boolean;
  qualityPercent: number;
  targetMb: number;
  grayscalePercent: number;
  isProcessing: boolean;
  progress: ProgressState;
  disabled: boolean;
  onExecute: () => void;
}

export const ReduceActionButton: React.FC<ReduceActionButtonProps> = ({
  result,
  isSettingsAltered,
  qualityPercent,
  targetMb,
  grayscalePercent,
  isProcessing,
  progress,
  disabled,
  onExecute,
}) => {
  const isBw = grayscalePercent === 100;

  return (
    <div className="flex flex-col gap-2">
      {result && isSettingsAltered && (
        <p className="text-xs text-center text-amber-800 font-semibold bg-amber-50 py-1.5 px-3 rounded border border-amber-300 animate-fadeIn">
          Settings altered ({isBw ? 'B&W Mode • ' : ''}{qualityPercent}% • ~{targetMb.toFixed(2)} MB). Click below to apply and download new size.
        </p>
      )}

      <Button
        type="button"
        variant={!result || isSettingsAltered ? 'primary' : 'outline'}
        size="md"
        onClick={onExecute}
        disabled={disabled}
        leftIcon={
          isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )
        }
        className="w-full py-2.5 text-xs font-semibold shadow-xs"
      >
        {isProcessing
          ? `Processing... (${progress.current}%)`
          : !result
          ? `Reduce & Enhance PDF (~${targetMb.toFixed(2)} MB${isBw ? ' • B&W' : ''})`
          : isSettingsAltered
          ? `Apply New Adjustments (~${targetMb.toFixed(2)} MB • ${qualityPercent}%${isBw ? ' • B&W' : ''})`
          : `Re-reduce (~${targetMb.toFixed(2)} MB • ${qualityPercent}%)`}
      </Button>
    </div>
  );
};
