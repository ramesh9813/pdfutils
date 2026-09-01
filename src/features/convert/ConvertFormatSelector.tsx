import React from 'react';
import type { FromFormat, ToFormat } from './convertTypes';
import { Card } from '../../components/common/Card';
import { RefreshCw } from 'lucide-react';

export interface ConvertFormatSelectorProps {
  fromFormat: FromFormat;
  toFormat: ToFormat;
  disabled?: boolean;
  onFromChange: (val: FromFormat) => void;
  onToChange: (val: ToFormat) => void;
}

export const ConvertFormatSelector: React.FC<ConvertFormatSelectorProps> = ({
  fromFormat,
  toFormat,
  disabled = false,
  onFromChange,
  onToChange,
}) => {
  const handleFromChange = (newFrom: FromFormat) => {
    onFromChange(newFrom);
    if (newFrom === 'pdf') {
      onToChange('jpg');
    } else {
      onToChange('pdf');
    }
  };

  return (
    <Card className="flex flex-col gap-3 p-4 border border-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-text-main">Conversion Format</h3>
            <p className="text-[11px] text-text-muted">Select input & output.</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
          {fromFormat} → {toFormat}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-text-main">From (Source)</label>
          <select
            value={fromFormat}
            disabled={disabled}
            onChange={(e) => handleFromChange(e.target.value as FromFormat)}
            className="rounded-lg border border-border bg-bg-surface px-3 py-2 text-xs font-medium text-text-main focus:border-primary focus:outline-hidden"
          >
            <option value="pdf">PDF Document (.pdf)</option>
            <option value="images">Images (.jpg, .png)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-text-main">To (Output)</label>
          <select
            value={toFormat}
            disabled={disabled}
            onChange={(e) => onToChange(e.target.value as ToFormat)}
            className="rounded-lg border border-border bg-bg-surface px-3 py-2 text-xs font-medium text-text-main focus:border-primary focus:outline-hidden"
          >
            {fromFormat === 'pdf' ? (
              <>
                <option value="jpg">JPG Images (.jpg)</option>
                <option value="png">PNG Images (.png)</option>
                <option value="webp">WEBP Images (.webp)</option>
                <option value="txt">Plain Text (.txt)</option>
              </>
            ) : (
              <option value="pdf">PDF Document (.pdf)</option>
            )}
          </select>
        </div>
      </div>
    </Card>
  );
};
