import React from 'react';

export interface RangeSliderItemProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  valueDisplay: string;
  min: number;
  max: number;
  step?: number;
  leftHint: string;
  centerHint?: string;
  rightHint: string;
  disabled?: boolean;
  onChange: (val: number) => void;
}

export const RangeSliderItem: React.FC<RangeSliderItemProps> = ({
  label,
  icon,
  value,
  valueDisplay,
  min,
  max,
  step = 1,
  leftHint,
  centerHint,
  rightHint,
  disabled = false,
  onChange,
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center text-xs">
      <span className="font-semibold text-text-main flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-mono text-xs font-bold text-primary">{valueDisplay}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary h-1.5 bg-border rounded cursor-pointer disabled:opacity-50"
    />
    <div className="flex justify-between text-[10px] text-text-muted">
      <span>{leftHint}</span>
      {centerHint && <span>{centerHint}</span>}
      <span>{rightHint}</span>
    </div>
  </div>
);
