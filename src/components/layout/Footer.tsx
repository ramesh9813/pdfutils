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
  Lock,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const coreTools = [
    { to: '/convert', label: 'Universal Convert', icon: RefreshCw },
    { to: '/reduce', label: 'Reduce & Enhance', icon: Minimize2 },
    { to: '/split', label: 'Split & Slices', icon: Scissors },
    { to: '/merge', label: 'Merge & Insert', icon: Layers },
  ];

  const quickLinks = [
    { to: '/', label: 'Overview' },
    { to: '/utils', label: 'All Utilities Hub' },
    { to: '/reorder', label: 'Reorder Pages' },
    { to: '/settings', label: 'Tool Preferences' },
  ];

  return (
    <footer className="w-full border-t border-border/80 bg-gradient-to-b from-bg-surface to-bg-subtle/60 mt-auto text-text-muted transition-colors">
      {/* Top Value Assurance Ribbon */}
      <div className="border-b border-border/60 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-sub">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold text-text-main">Local-First Architecture:</span>
            <span className="hidden sm:inline text-text-muted">PDF processing happens exclusively in your browser memory.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-text-sub">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>Zero Server Uploads</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Instant WebAssembly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="flex flex-col gap-3.5">
            <NavLink to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-text-main leading-none">
                  PDF<span className="text-primary">Utils</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                  100% In-Browser
                </span>
              </div>
            </NavLink>

            <p className="text-xs text-text-sub leading-relaxed">
              Open-source, client-side document processing suite engineered with PDF.js and WebAssembly.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/25 bg-primary/5 text-[11px] font-medium text-primary w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Client-Side Privacy Guaranteed</span>
            </div>
          </div>

          {/* Col 2: Core Toolkit */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Core Toolkit
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              {coreTools.map((t) => {
                const Icon = t.icon;
                return (
                  <NavLink
                    key={t.to}
                    to={t.to}
                    className="group flex items-center justify-between text-text-sub hover:text-primary transition-colors py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span>{t.label}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              {quickLinks.map((q) => (
                <NavLink
                  key={q.to}
                  to={q.to}
                  className="group flex items-center justify-between text-text-sub hover:text-primary transition-colors py-0.5"
                >
                  <span>{q.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </NavLink>
              ))}
            </div>
          </div>

          {/* Col 4: Engine & System Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Architecture
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-text-sub">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-text-main block">WebAssembly Core</span>
                  <span className="text-[11px] text-text-muted">In-memory execution</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-text-main block">Zero Latency</span>
                  <span className="text-[11px] text-text-muted">No cloud queues or limits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Actions */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-text-muted text-[11px]">
            <span>© {new Date().getFullYear()} PDFUtils.</span>
            <span>•</span>
            <span>Local & Private PDF Suite</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] bg-bg-surface border border-border px-2.5 py-1 rounded-md text-text-sub shadow-2xs">
              v2.5.0 • WebAssembly
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border border-border bg-bg-surface hover:border-primary/50 hover:text-primary text-text-main transition-colors shadow-2xs cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
