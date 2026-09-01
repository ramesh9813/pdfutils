import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Zap,
  ArrowUp,
  Cpu,
  Layers,
  Scissors,
  Minimize2,
  RefreshCw,
  Settings,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-border bg-bg-surface mt-auto text-text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Privacy Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-main">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-subtle text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight">
                PDF<span className="text-primary">Utils</span>
              </span>
            </div>
            <p className="text-xs text-text-sub leading-relaxed">
              Browser-native PDF suite. Zero server uploads, private in-memory processing.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-300/80 bg-emerald-50/90 dark:bg-emerald-950/40 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 w-fit">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Client-Side Private</span>
            </div>
          </div>

          {/* Core Tools Column */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Core Toolkit
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-text-sub">
              <NavLink to="/convert" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3 text-rose-500" />
                <span>Universal Convert</span>
              </NavLink>
              <NavLink to="/reduce" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Minimize2 className="h-3 w-3 text-emerald-500" />
                <span>Reduce Size & B&W</span>
              </NavLink>
              <NavLink to="/split" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Scissors className="h-3 w-3 text-sky-500" />
                <span>Split Slices & Cuts</span>
              </NavLink>
              <NavLink to="/merge" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-indigo-500" />
                <span>Merge & Insert Inside</span>
              </NavLink>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-text-sub">
              <NavLink to="/" className="hover:text-primary transition-colors">
                Landing Overview
              </NavLink>
              <NavLink to="/utils" className="hover:text-primary transition-colors">
                All Utilities Hub
              </NavLink>
              <NavLink to="/reorder" className="hover:text-primary transition-colors">
                Reorder Pages
              </NavLink>
              <NavLink to="/settings" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Settings className="h-3 w-3" />
                <span>Preferences</span>
              </NavLink>
            </div>
          </div>

          {/* Architecture & Engine Column */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Architecture
            </h4>
            <div className="flex flex-col gap-2 text-xs text-text-sub">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                <span>WebAssembly & Workers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Instant In-Memory Speed</span>
              </div>
              <span className="text-[11px] text-text-muted">
                ISO 32000-1 PDF Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Bottom divider & copyright bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-text-muted text-[11px]">
            © {new Date().getFullYear()} PDFUtils. Open-source client-side PDF processor.
          </span>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] bg-bg-subtle border border-border px-2 py-0.5 rounded text-text-sub">
              v2.5.0 • WebAssembly
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[11px] font-semibold text-text-sub hover:text-primary transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
