import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/common/Card';
import { ArrowUpDown } from 'lucide-react';

export const ReorderSettingsSection: React.FC = () => {
  const { settings, updateReorderSetting } = useSettings();
  const { confirmReverse, autoScroll } = settings.reorder;

  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-50 text-amber-600 border border-amber-200">
          <ArrowUpDown className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-text-main">Reorder Settings</h3>
          <p className="text-[11px] text-text-muted">Reorder tool defaults.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Confirm Reverse</span>
            <p className="text-[10px] text-text-muted">Prompt on reverse.</p>
          </div>
          <input
            type="checkbox"
            checked={confirmReverse}
            onChange={(e) => updateReorderSetting('confirmReverse', e.target.checked)}
            className="h-4 w-4 accent-primary rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Auto Scroll</span>
            <p className="text-[10px] text-text-muted">Follow moved page.</p>
          </div>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => updateReorderSetting('autoScroll', e.target.checked)}
            className="h-4 w-4 accent-primary rounded cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};
