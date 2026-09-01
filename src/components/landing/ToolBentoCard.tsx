import React from 'react';
import { Card } from '../common/Card';
import { ArrowRight } from 'lucide-react';

export interface ToolBentoCardProps {
  title: string;
  badge: string;
  badgeColorClass: string;
  icon: React.ReactNode;
  iconBgClass: string;
  description: string;
  tags: string[];
  hoverBorderClass: string;
  textColorClass: string;
  onClick: () => void;
}

export const ToolBentoCard: React.FC<ToolBentoCardProps> = ({
  title,
  badge,
  badgeColorClass,
  icon,
  iconBgClass,
  description,
  tags,
  hoverBorderClass,
  textColorClass,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-5 border border-border ${hoverBorderClass} bg-bg-surface hover:shadow-md transition-all cursor-pointer overflow-hidden`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconBgClass}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColorClass}`}>
            {badge}
          </span>
        </div>

        <div>
          <h3 className={`text-base font-bold text-text-main ${textColorClass} transition-colors flex items-center gap-1.5`}>
            {title}
            <ArrowRight className={`h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${textColorClass}`} />
          </h3>
          <p className="text-xs text-text-sub mt-1">{description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-bg-subtle text-text-sub px-2 py-0.5 rounded border border-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
