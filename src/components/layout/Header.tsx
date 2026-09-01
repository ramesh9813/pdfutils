import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Scissors, Layers, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-bg-surface px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 text-text-main hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-bg-subtle text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-text-main">
                PDF<span className="text-primary">Utils</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Browser Native
              </span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-bg-subtle text-primary border border-border'
                    : 'text-text-sub hover:text-text-main hover:bg-bg-subtle'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/split"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-bg-subtle text-primary border border-border'
                    : 'text-text-sub hover:text-text-main hover:bg-bg-subtle'
                }`
              }
            >
              <Scissors className="h-4 w-4" />
              Split PDF
            </NavLink>
            <NavLink
              to="/merge"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-bg-subtle text-primary border border-border'
                    : 'text-text-sub hover:text-text-main hover:bg-bg-subtle'
                }`
              }
            >
              <Layers className="h-4 w-4" />
              Merge PDF
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded border border-border bg-bg-subtle px-2.5 py-1 text-xs font-medium text-text-sub">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>100% Private • Local Processing</span>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <NavLink
              to="/split"
              className={({ isActive }) =>
                `p-2 rounded text-sm ${isActive ? 'bg-bg-subtle text-primary' : 'text-text-sub'}`
              }
              title="Split PDF"
            >
              <Scissors className="h-4 w-4" />
            </NavLink>
            <NavLink
              to="/merge"
              className={({ isActive }) =>
                `p-2 rounded text-sm ${isActive ? 'bg-bg-subtle text-primary' : 'text-text-sub'}`
              }
              title="Merge PDF"
            >
              <Layers className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
