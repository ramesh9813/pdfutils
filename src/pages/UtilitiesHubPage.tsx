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
      title: 'Reduce PDF File Size',
      description: 'Compress and minimize document MB size using dual sliders for visual fidelity percentage and target MB limit.',
      path: '/reduce',
      icon: <Minimize2 className="h-6 w-6 text-primary" />,
      badge: 'New Feature',
      badgeVariant: 'success' as const,
      features: ['Quality slider (0–100%)', 'Target MB slider', 'Client-side compression', 'Instant download'],
    },
    {
      title: 'Split PDF Document',
      description: 'Split into unlimited sections with Python-based slices (1:5, 6:9), double-click blue cut points, and selective part downloads.',
      path: '/split',
      icon: <Scissors className="h-6 w-6 text-primary" />,
      badge: 'Updated',
      badgeVariant: 'primary' as const,
      features: ['Python slice indexing', 'Blue cut overlays', 'Hold-to-reorder', 'Selective checkboxes'],
    },
    {
      title: 'Merge & Join PDFs',
      description: 'Join multiple PDFs at beginning, end, or inside / middle of another PDF (e.g. insert after page 3).',
      path: '/merge',
      icon: <Layers className="h-6 w-6 text-primary" />,
      badge: 'Updated',
      badgeVariant: 'primary' as const,
      features: ['Insert inside middle', 'Prepend / Append', 'Sequence flow preview', 'Range filters'],
    },
    {
      title: 'Reorder PDF Pages',
      description: 'Restructure page sequence, hold for ~1.2s to pick up and drop, reverse order, and download with custom rotation.',
      path: '/reorder',
      icon: <ArrowUpDown className="h-6 w-6 text-primary" />,
      badge: 'Ready',
      badgeVariant: 'neutral' as const,
      features: ['Hold & drop reorder', 'Reverse sequence', 'Rotate 90°', 'Single-page download'],
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            PDF Utilities Hub
          </h1>
          <p className="text-xs sm:text-sm text-text-sub mt-1">
            Zero-cloud, client-side PDF toolkit. Files are processed entirely in browser memory.
          </p>
        </div>
        <Badge variant="success" size="md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          All Engines Active
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Card key={tool.path} className="flex flex-col justify-between p-6 hover:border-primary/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-subtle">
                  {tool.icon}
                </div>
                <Badge variant={tool.badgeVariant} size="sm">
                  {tool.badge}
                </Badge>
              </div>

              <h2 className="text-lg font-bold text-text-main mb-2">{tool.title}</h2>
              <p className="text-xs text-text-sub mb-5 leading-relaxed">{tool.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
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
              className="inline-flex items-center justify-between w-full rounded border border-primary bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <span>{sharedFile ? `Use ${tool.title} with Uploaded PDF` : `Open ${tool.title}`}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
