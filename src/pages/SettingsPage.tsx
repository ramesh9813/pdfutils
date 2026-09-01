import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { SplitSettingsSection } from '../features/settings/SplitSettingsSection';
import { MergeSettingsSection } from '../features/settings/MergeSettingsSection';
import { ReduceSettingsSection } from '../features/settings/ReduceSettingsSection';
import { ReorderSettingsSection } from '../features/settings/ReorderSettingsSection';
import { Button } from '../components/common/Button';
import { Settings, RotateCcw } from 'lucide-react';

type Tab = 'all' | 'split' | 'merge' | 'reduce' | 'reorder';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { resetAllSettings } = useSettings();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'split', label: 'Split' },
    { id: 'merge', label: 'Join' },
    { id: 'reduce', label: 'Reduce' },
    { id: 'reorder', label: 'Reorder' },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full py-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Utility Settings
          </h1>
          <p className="text-xs text-text-sub mt-0.5">Preferences saved in memory and storage.</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetAllSettings}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          Reset Defaults
        </Button>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 flex-wrap border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-bg-subtle text-text-sub hover:text-text-main hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeTab === 'all' || activeTab === 'split') && <SplitSettingsSection />}
        {(activeTab === 'all' || activeTab === 'merge') && <MergeSettingsSection />}
        {(activeTab === 'all' || activeTab === 'reduce') && <ReduceSettingsSection />}
        {(activeTab === 'all' || activeTab === 'reorder') && <ReorderSettingsSection />}
      </div>
    </div>
  );
};
