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
          <span>Zero Server Uploads • 100% Client-Side In-Memory Execution</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main">
          Fast, Private PDF Processing in Your Browser
        </h1>

        <p className="text-sm sm:text-base text-text-sub max-w-2xl leading-relaxed">
          Split, extract, reorder, and merge PDF documents instantly with complete privacy.
          All computations run directly on your device utilizing WebAssembly and client-side web workers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="primary"
            leftIcon={<Scissors className="h-4 w-4" />}
            onClick={() => navigate('/split')}
          >
            Split PDF
          </Button>

          <Button
            size="lg"
            variant="secondary"
            leftIcon={<Layers className="h-4 w-4" />}
            onClick={() => navigate('/merge')}
          >
            Merge PDFs
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/utils')}
          >
            All Utilities (/utils)
          </Button>
        </div>
      </section>

      {/* Primary Tool Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
        {/* Split Card */}
        <Card className="flex flex-col justify-between hover:border-primary/60 transition-colors p-6 sm:p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-subtle text-primary mb-4">
              <Scissors className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Split & Extract PDF</h3>
            <p className="text-xs sm:text-sm text-text-sub mb-6 leading-relaxed">
              Extract specific page ranges, visually select pages from live thumbnail grids, split every N pages, or decompose documents into individual single-page files packed in a ZIP archive.
            </p>

            <ul className="space-y-2 mb-6 text-xs text-text-sub">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Visual thumbnail inspection & 90° rotation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Custom range syntax parsing (e.g. 1-3, 5, 8-10)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Combined single PDF or ZIP archive export</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/split')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Launch Split Tool
          </Button>
        </Card>

        {/* Merge Card */}
        <Card className="flex flex-col justify-between hover:border-primary/60 transition-colors p-6 sm:p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-subtle text-primary mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Merge & Combine PDFs</h3>
            <p className="text-xs sm:text-sm text-text-sub mb-6 leading-relaxed">
              Combine multiple PDF documents in any custom sequence. Drag & drop to reorder, specify per-file page intervals, rotate orientations, and download a pristine unified document.
            </p>

            <ul className="space-y-2 mb-6 text-xs text-text-sub">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Drag & drop reordering with live cover previews</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Selective page ranges per source document</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Zero file size limits enforced by servers</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/merge')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Launch Merge Tool
          </Button>
        </Card>
      </section>

      {/* Trust & Architecture Section */}
      <section className="border-t border-border pt-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-text-main">Enterprise Architecture & Security</h2>
          <p className="text-xs text-text-muted mt-1">Why browser-native PDF processing is the standard for confidential workflows.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <div className="rounded border border-border bg-bg-surface p-5 flex flex-col gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-text-main">Zero Network Transits</h4>
            <p className="text-xs text-text-sub leading-relaxed">
              Your confidential files, legal agreements, and medical records never leave your local machine or touch remote servers.
            </p>
          </div>

          <div className="rounded border border-border bg-bg-surface p-5 flex flex-col gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-text-main">Instant Local Speed</h4>
            <p className="text-xs text-text-sub leading-relaxed">
              No uploading megabytes of data or waiting in server queues. Splitting and merging are completed at wire speed in memory.
            </p>
          </div>

          <div className="rounded border border-border bg-bg-surface p-5 flex flex-col gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <Cpu className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-text-main">Standard Compliant</h4>
            <p className="text-xs text-text-sub leading-relaxed">
              Powered by pdf-lib and Mozilla PDF.js engines for pixel-perfect fidelity, font preservation, and ISO 32000 compliance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
