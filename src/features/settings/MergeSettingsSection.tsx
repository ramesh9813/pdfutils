import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/common/Card';
import { Layers } from 'lucide-react';

export const MergeSettingsSection: React.FC = () => {
  const { settings, updateMergeSetting } = useSettings();
  const { defaultPosition, autoClear } = settings.merge;

  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 border border-indigo-200">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-text-main">Join Settings</h3>
          <p className="text-[11px] text-text-muted">Merge tool defaults.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Insert Position</span>
            <p className="text-[10px] text-text-muted">Default target.</p>
          </div>
          <select
            value={defaultPosition}
            onChange={(e) => updateMergeSetting('defaultPosition', e.target.value as any)}
            className="rounded border border-border bg-bg-surface px-2 py-1 text-xs text-text-main"
          >
            <option value="end">End</option>
            <option value="start">Beginning</option>
            <option value="inside">Middle (Page X)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Auto Clear</span>
            <p className="text-[10px] text-text-muted">Reset on merge.</p>
          </div>
          <input
            type="checkbox"
            checked={autoClear}
            onChange={(e) => updateMergeSetting('autoClear', e.target.checked)}
            className="h-4 w-4 accent-primary rounded cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};
