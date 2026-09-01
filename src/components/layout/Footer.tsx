import React from 'react';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 z-40 h-14 w-full border-t border-border bg-bg-surface px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-text-sub font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Client-Side Security Guarantee</span>
          </div>
          <span className="hidden sm:inline text-border">|</span>
          <div className="hidden sm:flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Zero Server Uploads</span>
          </div>
          <span className="hidden md:inline text-border">|</span>
          <div className="hidden md:flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>Hardware-Accelerated Web Workers</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] bg-bg-subtle border border-border px-2 py-0.5 rounded text-text-sub">
            v1.0.0 Stable
          </span>
        </div>
      </div>
    </footer>
  );
};
