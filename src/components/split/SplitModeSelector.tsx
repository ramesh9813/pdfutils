import React from 'react';
import type { SplitMode } from '../../types/pdf.types';
import { Layers, Bookmark, FileSpreadsheet, Scissors } from 'lucide-react';

export interface SplitModeSelectorProps {
  mode: SplitMode;
  disabled?: boolean;
  onSelectMode: (mode: SplitMode) => void;
}

export const SplitModeSelector: React.FC<SplitModeSelectorProps> = ({
  mode,
  disabled = false,
  onSelectMode,
}) => {
  const modes: { id: SplitMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'range',
      label: 'Python Slices / Cut Points',
      desc: 'e.g. 1:5, 6:9, 10:50',
      icon: <Scissors className="h-4 w-4" />,
    },
    {
      id: 'extract',
      label: 'Extract Selected',
      desc: 'Pick individual pages',
      icon: <Bookmark className="h-4 w-4" />,
    },
    {
      id: 'single',
      label: 'Single Pages',
      desc: 'All pages as separate PDFs',
      icon: <FileSpreadsheet className="h-4 w-4" />,
    },
    {
      id: 'every_n',
      label: 'Every N Pages',
      desc: 'Fixed interval chunks',
      icon: <Layers className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelectMode(m.id)}
          className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
            mode === m.id
              ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
              : 'border-border bg-bg-surface hover:border-border hover:bg-bg-subtle/50 text-text-sub'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs text-text-main">
            <span className={mode === m.id ? 'text-primary' : 'text-text-muted'}>{m.icon}</span>
            <span>{m.label}</span>
          </div>
          <span className="text-[11px] text-text-muted mt-1">{m.desc}</span>
        </button>
      ))}
    </div>
  );
};
