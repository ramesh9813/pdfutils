import React from 'react';
import { Button } from '../../components/common/Button';
import { Minimize2, RotateCcw } from 'lucide-react';

export interface ReduceHeaderProps {
  hasActiveFile: boolean;
  isProcessing: boolean;
  onReset: () => void;
}

export const ReduceHeader: React.FC<ReduceHeaderProps> = ({
  hasActiveFile,
  isProcessing,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
          <Minimize2 className="h-6 w-6 text-primary" />
          Reduce PDF Size & Enhance
        </h1>
        <p className="text-xs text-text-sub mt-0.5">
          Compress MB size, convert to B&W, sharpen text, or boost colors.
        </p>
      </div>

      {hasActiveFile && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isProcessing}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          New PDF
        </Button>
      )}
    </div>
  );
};
