import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Scissors,
  Layers,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const UtilitiesHubPage: React.FC = () => {
  const tools = [
    {
      title: 'Split PDF Document',
      description: 'Extract specific pages, partition by custom ranges, or divide documents into individual pages with live visual previews.',
      path: '/split',
      icon: <Scissors className="h-6 w-6 text-primary" />,
      badge: 'Ready',
      features: ['Page range splitting', 'Single-page extraction', 'ZIP archiving', 'Orientation rotation'],
    },
    {
      title: 'Merge PDF Documents',
      description: 'Stitch together multiple PDFs in your desired sequence with drag-and-drop reordering and granular range controls.',
      path: '/merge',
      icon: <Layers className="h-6 w-6 text-primary" />,
      badge: 'Ready',
      features: ['Drag & drop reordering', 'Per-document ranges', 'Thumbnail inspection', 'Batch combining'],
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Utilities Hub</h1>
          <p className="text-xs sm:text-sm text-text-sub mt-1">
            Browser-native, zero-cloud PDF manipulation toolkit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            All Engines Online
          </Badge>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Card key={tool.path} className="flex flex-col justify-between p-6 hover:border-primary/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-subtle">
                  {tool.icon}
                </div>
                <Badge variant="primary" size="sm">
                  {tool.badge}
                </Badge>
              </div>

              <h2 className="text-lg font-bold text-text-main mb-2">{tool.title}</h2>
              <p className="text-xs text-text-sub mb-5 leading-relaxed">{tool.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {tool.features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-[11px] rounded bg-bg-subtle border border-border px-2 py-0.5 text-text-sub"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <NavLink
              to={tool.path}
              className="inline-flex items-center justify-between w-full rounded border border-primary bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              <span>Open Tool</span>
              <ArrowUpRight className="h-4 w-4" />
            </NavLink>
          </Card>
        ))}
      </div>

      {/* System Status & Specifications */}
      <Card subtle padding="md" className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          Technical Runtime Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex flex-col gap-1 p-3 rounded border border-border bg-bg-surface">
            <span className="text-text-muted font-medium">Core Engine</span>
            <span className="font-semibold text-text-main">pdf-lib v1.17 + pdfjs-dist</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded border border-border bg-bg-surface">
            <span className="text-text-muted font-medium">Memory Isolation</span>
            <span className="font-semibold text-text-main">Sandboxed Browser Thread</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded border border-border bg-bg-surface">
            <span className="text-text-muted font-medium">Compression Algorithm</span>
            <span className="font-semibold text-text-main">DEFLATE (JSZip Client Level 6)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
