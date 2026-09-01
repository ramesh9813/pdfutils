import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/common/Card';
import { Minimize2 } from 'lucide-react';

export const ReduceSettingsSection: React.FC = () => {
  const { settings, updateReduceSetting } = useSettings();
  const { defaultQuality, defaultBw, defaultTextWeight } = settings.reduce;

  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
          <Minimize2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-text-main">Quality Reduction</h3>
          <p className="text-[11px] text-text-muted">Compression defaults.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-main">Initial Quality</span>
            <p className="text-[10px] text-text-muted">Compression level.</p>
          </div>
          <span className="text-xs font-bold font-mono text-primary">{defaultQuality}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="95"
          step="5"
          value={defaultQuality}
          onChange={(e) => updateReduceSetting('defaultQuality', Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-border rounded cursor-pointer"
        />

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-text-main">B&W Default</span>
            <p className="text-[10px] text-text-muted">Monochrome scan.</p>
          </div>
          <input
            type="checkbox"
            checked={defaultBw}
            onChange={(e) => updateReduceSetting('defaultBw', e.target.checked)}
            className="h-4 w-4 accent-primary rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-text-main">Text Weight</span>
            <p className="text-[10px] text-text-muted">Stroke boldness.</p>
          </div>
          <span className="text-xs font-bold font-mono text-primary">{defaultTextWeight}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={defaultTextWeight}
          onChange={(e) => updateReduceSetting('defaultTextWeight', Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-border rounded cursor-pointer"
        />
      </div>
    </Card>
  );
};
