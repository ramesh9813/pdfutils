import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolBentoCard } from './ToolBentoCard';
import { Scissors, Layers, ArrowUpDown, Minimize2, ArrowRight } from 'lucide-react';

export const ToolBentoGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-5xl mx-auto w-full flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-main">
            Core Toolkit
          </h2>
          <p className="text-[11px] text-text-muted">
            In-memory PDF utilities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/utils')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          All Tools <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <ToolBentoCard
          title="Split PDF"
          badge="1:5, 6:9"
          badgeColorClass="text-sky-700 bg-sky-100/80 border-sky-300"
          icon={<Scissors className="h-5 w-5" />}
          iconBgClass="bg-sky-50 text-primary border-sky-200"
          description="Visual cuts or Python slices."
          tags={['Slices', 'Cut Points', 'Rotate 90°']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/split')}
        />

        <ToolBentoCard
          title="Merge & Insert"
          badge="Insert Inside"
          badgeColorClass="text-indigo-700 bg-indigo-100/80 border-indigo-300"
          icon={<Layers className="h-5 w-5" />}
          iconBgClass="bg-indigo-50 text-indigo-600 border-indigo-200"
          description="Join start, end, or middle."
          tags={['Middle Insert', 'Flowchart', 'Reorder']}
          hoverBorderClass="hover:border-indigo-500/60"
          textColorClass="group-hover:text-indigo-600"
          onClick={() => navigate('/merge')}
        />

        <ToolBentoCard
          title="Reorder Pages"
          badge="< > Chevrons"
          badgeColorClass="text-amber-700 bg-amber-100/80 border-amber-300"
          icon={<ArrowUpDown className="h-5 w-5" />}
          iconBgClass="bg-amber-50 text-amber-600 border-amber-200"
          description="Drag, move, or 1-click reverse."
          tags={['Move Arrows', 'Drag & Drop', 'Reverse']}
          hoverBorderClass="hover:border-amber-500/60"
          textColorClass="group-hover:text-amber-600"
          onClick={() => navigate('/reorder')}
        />

        <ToolBentoCard
          title="Reduce Size & B&W"
          badge="Compression"
          badgeColorClass="text-emerald-700 bg-emerald-100/80 border-emerald-300"
          icon={<Minimize2 className="h-5 w-5" />}
          iconBgClass="bg-emerald-50 text-emerald-600 border-emerald-200"
          description="Compress MB size and tune visuals."
          tags={['MB Sliders', 'B&W Scan', 'Text Weight']}
          hoverBorderClass="hover:border-emerald-500/60"
          textColorClass="group-hover:text-emerald-600"
          onClick={() => navigate('/reduce')}
        />
      </div>
    </section>
  );
};
