import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 rounded border border-border bg-bg-surface px-3 py-1 text-xs font-medium text-text-sub shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>100% Local • Private In-Memory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main">
          Fast, Private PDF Utilities
        </h1>

        <p className="text-sm text-text-sub max-w-lg">
          Split, merge, reorder, and compress PDFs locally in browser memory.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            size="md"
            variant="primary"
            leftIcon={<Scissors className="h-4 w-4" />}
            onClick={() => navigate('/split')}
          >
            Split PDF
          </Button>

          <Button
            size="md"
            variant="secondary"
            leftIcon={<Layers className="h-4 w-4" />}
            onClick={() => navigate('/merge')}
          >
            Merge PDFs
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/utils')}
          >
            All Tools (/utils)
          </Button>
        </div>
      </section>

      {/* Primary Tool Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full">
        {/* Split Card */}
        <Card className="flex flex-col justify-between hover:border-primary/60 transition-colors p-6">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-bg-subtle text-primary mb-3">
              <Scissors className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">Split PDF</h3>
            <p className="text-xs text-text-sub mb-4">
              Split by Python slices, visual cut points, or individual pages.
            </p>

            <ul className="space-y-1.5 mb-5 text-xs text-text-sub">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Visual cut points & 90° rotation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Python slice indexing (e.g. 1:5, 6:9)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Selective part downloads & ZIP export</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/split')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Open Split Tool
          </Button>
        </Card>

        {/* Merge Card */}
        <Card className="flex flex-col justify-between hover:border-primary/60 transition-colors p-6">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-bg-subtle text-primary mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">Merge PDFs</h3>
            <p className="text-xs text-text-sub mb-4">
              Join multiple PDFs at beginning, end, or inside another document.
            </p>

            <ul className="space-y-1.5 mb-5 text-xs text-text-sub">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Insert inside middle (after page X)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Live assembly flow preview</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Drag & drop reordering</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/merge')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Open Merge Tool
          </Button>
        </Card>
      </section>

      {/* Trust & Architecture Section */}
      <section className="border-t border-border pt-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-text-main">Architecture & Security</h2>
          <p className="text-xs text-text-muted mt-0.5">Zero cloud transit, 100% in-browser security.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-5xl mx-auto">
          <div className="rounded border border-border bg-bg-surface p-4 flex flex-col gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-text-main">Zero Uploads</h4>
            <p className="text-[11px] text-text-sub">Files never leave your browser.</p>
          </div>

          <div className="rounded border border-border bg-bg-surface p-4 flex flex-col gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-text-main">Instant Speed</h4>
            <p className="text-[11px] text-text-sub">In-memory processing without server wait.</p>
          </div>

          <div className="rounded border border-border bg-bg-surface p-4 flex flex-col gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-text-main">ISO Standard</h4>
            <p className="text-[11px] text-text-sub">Full fidelity via pdf-lib and PDF.js.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
