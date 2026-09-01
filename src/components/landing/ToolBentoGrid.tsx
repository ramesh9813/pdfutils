import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolBentoCard } from './ToolBentoCard';
import {
  Scissors,
  Layers,
  ArrowUpDown,
  Minimize2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

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
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          All Tools <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <ToolBentoCard
          title="Convert PDF"
          badge="PDF ↔ Images, Office"
          badgeColorClass="text-primary bg-primary/10 border-primary/30"
          icon={<RefreshCw className="h-5 w-5" />}
          iconBgClass="bg-primary/10 text-primary border-primary/20"
          description="Convert PDF to Word, Excel, JPG, and MD."
          tags={['PDF to DOCX', 'PDF to XLSX', 'Images to PDF']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/convert')}
        />

        <ToolBentoCard
          title="Reduce Size & B&W"
          badge="Target MB Precision"
          badgeColorClass="text-primary bg-primary/10 border-primary/30"
          icon={<Minimize2 className="h-5 w-5" />}
          iconBgClass="bg-primary/10 text-primary border-primary/20"
          description="Compress MB size and tune visuals."
          tags={['Target MB', 'B&W Scan', 'Text Weight']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/reduce')}
        />

        <ToolBentoCard
          title="Split PDF"
          badge="1:5, 6:9 Slices"
          badgeColorClass="text-primary bg-primary/10 border-primary/30"
          icon={<Scissors className="h-5 w-5" />}
          iconBgClass="bg-primary/10 text-primary border-primary/20"
          description="Visual cuts or Python slices."
          tags={['Slices', 'Cut Points', 'Rotate 90°']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/split')}
        />

        <ToolBentoCard
          title="Merge & Insert"
          badge="Insert Inside"
          badgeColorClass="text-primary bg-primary/10 border-primary/30"
          icon={<Layers className="h-5 w-5" />}
          iconBgClass="bg-primary/10 text-primary border-primary/20"
          description="Join start, end, or middle."
          tags={['Middle Insert', 'Flowchart', 'Reorder']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/merge')}
        />

        <ToolBentoCard
          title="Reorder Pages"
          badge="< > Chevrons"
          badgeColorClass="text-primary bg-primary/10 border-primary/30"
          icon={<ArrowUpDown className="h-5 w-5" />}
          iconBgClass="bg-primary/10 text-primary border-primary/20"
          description="Drag, move, or 1-click reverse."
          tags={['Move Arrows', 'Drag & Drop', 'Reverse']}
          hoverBorderClass="hover:border-primary/60"
          textColorClass="group-hover:text-primary"
          onClick={() => navigate('/reorder')}
        />
      </div>
    </section>
  );
};
