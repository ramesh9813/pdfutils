import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  ChevronDown,
  Scissors,
  Layers,
  Minimize2,
  ArrowUpDown,
  Home,
  Check,
  RefreshCw,
  Settings,
} from 'lucide-react';

export const HeaderToolsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Overview', icon: <Home className="h-4 w-4 text-primary" /> },
    { path: '/utils', label: 'Utilities Hub', icon: <LayoutGrid className="h-4 w-4 text-primary" /> },
    { path: '/convert', label: 'Convert PDF', icon: <RefreshCw className="h-4 w-4 text-primary" /> },
    { path: '/reduce', label: 'Reduce PDF Size', icon: <Minimize2 className="h-4 w-4 text-primary" /> },
    { path: '/split', label: 'Split PDF', icon: <Scissors className="h-4 w-4 text-primary" /> },
    { path: '/merge', label: 'Merge & Insert', icon: <Layers className="h-4 w-4 text-primary" /> },
    { path: '/reorder', label: 'Reorder Pages', icon: <ArrowUpDown className="h-4 w-4 text-primary" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4 text-primary" /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'bg-primary text-white border-primary shadow-xs'
            : 'bg-bg-surface text-text-main border-border hover:border-primary/50 hover:bg-bg-subtle'
        }`}
      >
        <LayoutGrid className="h-4 w-4 text-primary group-hover:text-white" />
        <span>Tools & Navigation</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-bg-surface p-1.5 shadow-lg z-50 animate-fadeIn">
          <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Select Utility
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-text-sub hover:text-text-main hover:bg-bg-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
