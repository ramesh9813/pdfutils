import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedPdf } from '../context/PdfContext';
import { QuickStartUploadCard } from '../components/common/QuickStartUploadCard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Scissors,
  Layers,
  Minimize2,
  ArrowUpDown,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Settings,
} from 'lucide-react';

export const UtilitiesHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { sharedFile, setSharedFile, clearSharedFile } = useSharedPdf();

  const handleTopUpload = (files: File[]) => {
    if (files.length > 0) {
      setSharedFile(files[0]);
    }
  };

  const tools = [
    {
      title: 'Convert PDF',
      description: 'PDF to JPG, PNG, TXT.',
      path: '/convert',
      icon: <RefreshCw className="h-5 w-5 text-rose-500" />,
      badge: 'New',
      badgeVariant: 'success' as const,
      features: ['PDF to Images', 'Images to PDF', 'Text'],
    },
    {
      title: 'Reduce PDF Size',
      description: 'Compress MB and tune visuals.',
      path: '/reduce',
      icon: <Minimize2 className="h-5 w-5 text-primary" />,
      badge: 'Updated',
      badgeVariant: 'primary' as const,
      features: ['MB Sliders', 'B&W Mode', 'Text Weight'],
    },
    {
      title: 'Split PDF',
      description: 'Visual cuts or Python slices.',
      path: '/split',
      icon: <Scissors className="h-5 w-5 text-primary" />,
      badge: 'Ready',
      badgeVariant: 'neutral' as const,
      features: ['Slices', 'Cut Points', 'Rotate 90°'],
    },
    {
      title: 'Merge & Insert',
      description: 'Join start, end, or middle.',
      path: '/merge',
      icon: <Layers className="h-5 w-5 text-primary" />,
      badge: 'Ready',
      badgeVariant: 'neutral' as const,
      features: ['Middle Insert', 'Flowchart', 'Reorder'],
    },
    {
      title: 'Reorder Pages',
      description: 'Drag, move, or 1-click reverse.',
      path: '/reorder',
      icon: <ArrowUpDown className="h-5 w-5 text-primary" />,
      badge: 'Ready',
      badgeVariant: 'neutral' as const,
      features: ['Move Arrows', 'Drag & Drop', 'Reverse'],
    },
    {
      title: 'Utility Settings',
      description: 'Preferences and tool defaults.',
      path: '/settings',
      icon: <Settings className="h-5 w-5 text-text-sub" />,
      badge: 'Config',
      badgeVariant: 'neutral' as const,
      features: ['In-Memory', 'Local Storage', 'Defaults'],
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full py-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            PDF Utilities Hub
          </h1>
          <p className="text-xs text-text-sub mt-0.5">
            Browser-native in-memory PDF toolkit.
          </p>
        </div>
        <Badge variant="success" size="sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          Ready
        </Badge>
      </div>

      {/* 1. DEFAULT TOP UPLOAD CARD */}
      <QuickStartUploadCard
        sharedFile={sharedFile}
        onUpload={handleTopUpload}
        onClear={clearSharedFile}
        onNavigate={(path) => navigate(path)}
      />

      {/* 2. GRID OF TOOL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card key={tool.path} className="flex flex-col justify-between p-5 hover:border-primary/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-bg-subtle">
                  {tool.icon}
                </div>
                <Badge variant={tool.badgeVariant} size="sm">
                  {tool.badge}
                </Badge>
              </div>

              <h2 className="text-base font-bold text-text-main mb-1">{tool.title}</h2>
              <p className="text-xs text-text-sub mb-3">{tool.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center text-[11px] rounded bg-bg-subtle border border-border px-2 py-0.5 text-text-sub">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(tool.path)}
              className="inline-flex items-center justify-between w-full rounded border border-primary bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <span>{sharedFile ? `Open with Uploaded PDF` : `Open Tool`}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
