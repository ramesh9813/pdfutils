import React from 'react';
import { Button } from '../../components/common/Button';
import { FileText } from 'lucide-react';
import type { TargetFormat } from './convertTypes';

export interface ConvertFileBannerProps {
  files: File[];
  toFormat: TargetFormat;
  onReset: () => void;
}

export const ConvertFileBanner: React.FC<ConvertFileBannerProps> = ({
  files,
  toFormat,
  onReset,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-bg-surface">
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-bold text-text-main truncate">
            {files.length === 1 ? files[0].name : `${files.length} images selected`}
          </span>
          <span className="text-[11px] text-text-muted">
            Ready to convert to <strong className="text-text-main uppercase">{toFormat}</strong>
          </span>
        </div>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onReset}>
        Change
      </Button>
    </div>
  );
};
