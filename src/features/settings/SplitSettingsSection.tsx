import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/common/Card';
import { Scissors } from 'lucide-react';

export const SplitSettingsSection: React.FC = () => {
  const { settings, updateSplitSetting } = useSettings();
  const { defaultMode, defaultSlice, autoZip } = settings.split;

  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-sky-50 text-sky-600 border border-sky-200">
          <Scissors className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-text-main">Split Settings</h3>
          <p className="text-[11px] text-text-muted">Split tool defaults.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Default Mode</span>
            <p className="text-[10px] text-text-muted">Initial tab.</p>
          </div>
          <select
            value={defaultMode}
            onChange={(e) => updateSplitSetting('defaultMode', e.target.value as any)}
            className="rounded border border-border bg-bg-surface px-2 py-1 text-xs text-text-main"
          >
            <option value="slice">Python Slices</option>
            <option value="visual">Visual Cuts</option>
            <option value="all">Single Pages</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Default Slice</span>
            <p className="text-[10px] text-text-muted">Preset range.</p>
          </div>
          <input
            type="text"
            value={defaultSlice}
            onChange={(e) => updateSplitSetting('defaultSlice', e.target.value)}
            className="w-24 rounded border border-border bg-bg-surface px-2 py-1 text-xs text-text-main font-mono text-center"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Auto ZIP</span>
            <p className="text-[10px] text-text-muted">Bundle files.</p>
          </div>
          <input
            type="checkbox"
            checked={autoZip}
            onChange={(e) => updateSplitSetting('autoZip', e.target.checked)}
            className="h-4 w-4 accent-primary rounded cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};
