import React from 'react';
import { Lock, Zap, Cpu } from 'lucide-react';

export const LandingTrustSection: React.FC = () => {
  return (
    <section className="border-t border-border pt-6 mt-2">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold text-text-main">
          Zero Cloud Footprint
        </h2>
        <p className="text-[11px] text-text-muted mt-0.5">
          Local WebAssembly runtime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-5xl mx-auto">
        <div className="rounded-xl border border-border bg-bg-surface p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">Client-Side Privacy</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              Runs in RAM. Zero server uploads.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">Instant Speed</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              In-memory execution without queues.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-main">ISO Engine</h4>
            <p className="text-[11px] text-text-sub mt-0.5">
              Preserves vectors, links, and rotations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
