import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolBentoCard } from './ToolBentoCard';
import { Scissors, Layers, ArrowUpDown, Minimize2, ArrowRight } from 'lucide-react';

export const ToolBentoGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-5xl mx-auto w-full flex flex-col gap-5 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-text-main">
            Core Toolkit
          </h2>
          <p className="text-xs text-text-muted">
            Engineered for high fidelity and zero cloud footprint.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/utils')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View /utils Hub <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolBentoCard
          title="Split PDF"
          badge="1:5, 6:9 Python Slices"
          badgeColorClass="text-sky-700 bg-sky-100/80 border-sky-300"
          icon={<Scissors className="h-5 w-5" />}
          iconBgClass="bg-sky-50 text-primary border-sky-200"
          description="Double-click previews to place visual cut points with blue overlays, or specify Python range slices."
          tags={['Python Slices', 'Double-Click Cuts', '90° Page Rotate', 'ZIP Export']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/split')}
        />

        <ToolBentoCard
          title="Merge & Insert Inside"
          badge="Insert Inside Middle"
          badgeColorClass="text-indigo-700 bg-indigo-100/80 border-indigo-300"
          icon={<Layers className="h-5 w-5" />}
          iconBgClass="bg-indigo-50 text-indigo-600 border-indigo-200"
          description="Combine PDFs at the start, end, or embed documents inside another after page X with sequence flowchart preview."
          tags={['Middle Insert (After Page X)', 'Flowchart Preview', 'Drag Reorder']}
          hoverBorderClass="hover:border-indigo-500/60"
          textColorClass="group-hover:text-indigo-600"
          onClick={() => navigate('/merge')}
        />

        <ToolBentoCard
          title="Reorder Pages"
          badge="Instant < > Chevrons"
          badgeColorClass="text-amber-700 bg-amber-100/80 border-amber-300"
          icon={<ArrowUpDown className="h-5 w-5" />}
          iconBgClass="bg-amber-50 text-amber-600 border-amber-200"
          description="Restructure page order instantly. Use direct move arrows, hold-to-pickup dragging, or reverse order in one click."
          tags={['Direct Move Arrows', 'Hold-to-Pickup Drag', '1-Click Reverse']}
          hoverBorderClass="hover:border-amber-500/60"
          textColorClass="group-hover:text-amber-600"
          onClick={() => navigate('/reorder')}
        />

        <ToolBentoCard
          title="Reduce Size & Visual Tuning"
          badge="B&W Scan + Compression"
          badgeColorClass="text-emerald-700 bg-emerald-100/80 border-emerald-300"
          icon={<Minimize2 className="h-5 w-5" />}
          iconBgClass="bg-emerald-50 text-emerald-600 border-emerald-200"
          description="Shrink MB size with sliders, convert documents to clean black & white scans, and enhance brightness & contrast."
          tags={['Target MB Slider', 'Black & White Mode', 'Brightness & Contrast', 'Live Filter Preview']}
          hoverBorderClass="hover:border-emerald-500/60"
          textColorClass="group-hover:text-emerald-600"
          onClick={() => navigate('/reduce')}
        />
      </div>
    </section>
  );
};
