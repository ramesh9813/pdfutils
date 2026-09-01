import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedPdf } from '../../context/PdfContext';
import {
  ShieldCheck,
  Scissors,
  Layers,
  ArrowUpDown,
  Minimize2,
  RefreshCw,
  Upload,
  FileText,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const { setSharedFile } = useSharedPdf();
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setStagedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStagedFile(e.target.files[0]);
    }
  };

  const handleLaunch = (path: string) => {
    if (stagedFile) setSharedFile(stagedFile);
    navigate(path);
  };

  const tools = [
    { path: '/convert', label: 'Convert', icon: <RefreshCw className="h-3.5 w-3.5 text-primary" /> },
    { path: '/reduce', label: 'Reduce', icon: <Minimize2 className="h-3.5 w-3.5 text-primary" /> },
    { path: '/split', label: 'Split', icon: <Scissors className="h-3.5 w-3.5 text-primary" /> },
    { path: '/merge', label: 'Merge', icon: <Layers className="h-3.5 w-3.5 text-primary" /> },
    { path: '/reorder', label: 'Reorder', icon: <ArrowUpDown className="h-3.5 w-3.5 text-primary" /> },
  ];

  return (
    <section className="relative text-center max-w-4xl mx-auto flex flex-col items-center gap-4 pt-2 sm:pt-6">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 px-3 py-0.5 text-xs font-semibold text-primary shadow-2xs">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span>100% Client-Side • Zero Server Uploads</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main">
        In-Browser{' '}
        <span className="text-primary">
          PDF Utilities
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-text-sub max-w-md">
        Split, merge, convert, and compress PDFs locally in browser memory.
      </p>

      {/* Interactive Quick Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="w-full max-w-2xl mt-1 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-b from-sky-50/50 to-bg-surface hover:border-primary/60 transition-all shadow-xs"
      >
        {!stagedFile ? (
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-text-main">
                Drop PDF here or click to choose
              </span>
              <span className="text-[10px] text-text-muted mt-0.5">
                In-memory local processing.
              </span>
            </div>
          </label>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-bg-surface border border-border">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-bold text-text-main truncate">{stagedFile.name}</span>
                  <span className="text-[10px] text-text-muted">
                    {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStagedFile(null)}
                className="text-[11px] font-medium text-text-muted hover:text-text-main px-2 py-0.5"
              >
                Change PDF
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {tools.map((t) => (
                <button
                  key={t.path}
                  type="button"
                  onClick={() => handleLaunch(t.path)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-bg-surface border border-border hover:border-primary/50 text-text-main hover:bg-bg-subtle shadow-2xs"
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!stagedFile && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {tools.map((t) => (
            <button
              key={t.path}
              type="button"
              onClick={() => navigate(t.path)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-surface border border-border hover:border-primary/50 text-text-main shadow-2xs hover:shadow-xs transition-all"
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
