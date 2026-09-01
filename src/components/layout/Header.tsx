import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ShieldCheck } from 'lucide-react';
import { HeaderToolsDropdown } from './HeaderToolsDropdown';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-bg-surface px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 text-text-main hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-subtle text-primary shadow-2xs">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-text-main leading-none">
              PDF<span className="text-primary">Utils</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted mt-0.5">
              Browser Native
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50/90 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Private</span>
          </div>

          {/* Single Header Button that expands all options */}
          <HeaderToolsDropdown />
        </div>
      </div>
    </header>
  );
};
