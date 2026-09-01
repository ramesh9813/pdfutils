import React from 'react';
import { Card } from '../../components/common/Card';
import { RangeSliderItem } from './RangeSliderItem';
import { Sliders, Sun, Contrast, Droplet, Palette, RotateCcw, FileText } from 'lucide-react';

export interface ColorAdjustmentSlidersProps {
  grayscalePercent: number;
  brightnessPercent: number;
  contrastPercent: number;
  saturationPercent: number;
  disabled?: boolean;
  onGrayscaleChange: (val: number) => void;
  onBrightnessChange: (val: number) => void;
  onContrastChange: (val: number) => void;
  onSaturationChange: (val: number) => void;
  onApplyPreset: (opts: { grayscale?: number; brightness?: number; contrast?: number; saturation?: number }) => void;
}

export const ColorAdjustmentSliders: React.FC<ColorAdjustmentSlidersProps> = ({
  grayscalePercent,
  brightnessPercent,
  contrastPercent,
  saturationPercent,
  disabled = false,
  onGrayscaleChange,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onApplyPreset,
}) => {
  const isCustomized =
    grayscalePercent > 0 ||
    brightnessPercent !== 100 ||
    contrastPercent !== 100 ||
    saturationPercent !== 100;

  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-text-main">
              Color & Document Enhancements
            </h4>
            <p className="text-[11px] text-text-muted">
              Convert to black & white, adjust brightness, contrast, and saturation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onApplyPreset({ grayscale: 100, brightness: 105, contrast: 130, saturation: 0 })}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
              grayscalePercent === 100
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-bg-subtle text-text-sub hover:bg-slate-200 border-border'
            }`}
          >
            <FileText className="h-3 w-3 inline mr-1" />
            B&W Scan
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onApplyPreset({ contrast: 140, brightness: 100, grayscale: 0, saturation: 100 })}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
              contrastPercent === 140 && grayscalePercent === 0
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-bg-subtle text-text-sub hover:bg-slate-200 border-border'
            }`}
          >
            <Contrast className="h-3 w-3 inline mr-1" />
            High Contrast
          </button>
          {isCustomized && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onApplyPreset({ grayscale: 0, brightness: 100, contrast: 100, saturation: 100 })}
              className="px-2 py-1 rounded text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RangeSliderItem
          label="Black & White (Grayscale)"
          icon={<Palette className="h-3.5 w-3.5 text-text-sub" />}
          value={grayscalePercent}
          valueDisplay={grayscalePercent === 0 ? 'Color (0%)' : grayscalePercent === 100 ? 'Full B&W (100%)' : `${grayscalePercent}%`}
          min={0}
          max={100}
          step={5}
          leftHint="Color (0%)"
          rightHint="B&W (100%)"
          disabled={disabled}
          onChange={onGrayscaleChange}
        />
        <RangeSliderItem
          label="Brightness"
          icon={<Sun className="h-3.5 w-3.5 text-amber-500" />}
          value={brightnessPercent}
          valueDisplay={`${brightnessPercent}%`}
          min={50}
          max={150}
          step={5}
          leftHint="Darker (50%)"
          centerHint="Normal (100%)"
          rightHint="Brighter (150%)"
          disabled={disabled}
          onChange={onBrightnessChange}
        />
        <RangeSliderItem
          label="Contrast"
          icon={<Contrast className="h-3.5 w-3.5 text-blue-600" />}
          value={contrastPercent}
          valueDisplay={`${contrastPercent}%`}
          min={50}
          max={200}
          step={5}
          leftHint="Soft (50%)"
          centerHint="Normal (100%)"
          rightHint="Sharp (200%)"
          disabled={disabled}
          onChange={onContrastChange}
        />
        <RangeSliderItem
          label="Saturation"
          icon={<Droplet className="h-3.5 w-3.5 text-rose-500" />}
          value={saturationPercent}
          valueDisplay={`${saturationPercent}%`}
          min={0}
          max={200}
          step={5}
          leftHint="Muted (0%)"
          centerHint="Normal (100%)"
          rightHint="Vivid (200%)"
          disabled={disabled}
          onChange={onSaturationChange}
        />
      </div>
    </Card>
  );
};
