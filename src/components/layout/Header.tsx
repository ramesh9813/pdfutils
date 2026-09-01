import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { HeaderToolsDropdown } from './HeaderToolsDropdown';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-bg-surface px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 text-text-main hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-subtle text-primary shadow-2xs">
            <FileText className="h-5 w-5" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-base font-bold tracking-tight text-text-main leading-none">
              PDF<span className="text-primary">Utils</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted mt-0.5">
              Browser Native
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>100% Private</span>
          </div>

          {/* Mode (Light / Dark) Button - Icon only on mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border border-border bg-bg-surface hover:border-primary/50 hover:bg-bg-subtle text-text-main shadow-2xs transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-primary" />
            ) : (
              <Sun className="h-4 w-4 text-primary" />
            )}
            <span className="hidden sm:inline">Mode</span>
          </button>

          {/* Single Header Button that expands all options */}
          <HeaderToolsDropdown />
        </div>
      </div>
    </header>
  );
};
