import React from 'react';
import { Lock, Zap, Cpu } from 'lucide-react';

export const LandingTrustSection: React.FC = () => {
  return (
    <section className="border-t border-border pt-8 mt-2">
      <div className="text-center mb-6">
        <h2 className="text-base sm:text-lg font-bold text-text-main">
          Zero Cloud Footprint
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Everything executes in your local WebAssembly and Web Worker runtime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-5xl mx-auto">
        <div className="rounded-xl border border-border bg-bg-surface p-4 flex flex-col gap-2 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">100% Client-Side Privacy</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              Documents are processed directly in browser RAM. Zero bytes are uploaded to any external server.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-4 flex flex-col gap-2 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-primary border border-sky-200">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">Sub-Second Processing</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              Instant PDF parsing, parallel page rendering, and direct in-memory downloads with no queue delays.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-4 flex flex-col gap-2 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">Standard ISO PDF Engine</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              Powered by pdf-lib and PDF.js. Retains vector graphics, bookmarks, metadata, and custom page rotations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
