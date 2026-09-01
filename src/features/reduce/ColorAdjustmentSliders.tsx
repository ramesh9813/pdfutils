import React from 'react';
import type { ColorAdjustmentOptions } from './reduceTypes';
import { Card } from '../../components/common/Card';
import { RangeSliderItem } from './RangeSliderItem';
import { AdjustmentPresetsRow } from './AdjustmentPresetsRow';
import { Sliders, Sun, Contrast, Droplet, Palette, Zap, Sparkles, Bold } from 'lucide-react';

export interface ColorAdjustmentSlidersProps {
  visuals: ColorAdjustmentOptions;
  disabled?: boolean;
  onUpdateVisual: (key: keyof ColorAdjustmentOptions, val: number) => void;
  onApplyPreset: (patch: Partial<ColorAdjustmentOptions>) => void;
}

export const ColorAdjustmentSliders: React.FC<ColorAdjustmentSlidersProps> = ({
  visuals,
  disabled = false,
  onUpdateVisual,
  onApplyPreset,
}) => {
  return (
    <Card className="flex flex-col gap-4 p-4 border border-border bg-bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-text-main">
              Color, Sharpness & Tone Enhancements
            </h4>
            <p className="text-[11px] text-text-muted">
              Convert to B&W, sharpen text edges, and intensify colors & darks.
            </p>
          </div>
        </div>

        <AdjustmentPresetsRow
          visuals={visuals}
          disabled={disabled}
          onApplyPreset={onApplyPreset}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RangeSliderItem
          label="Black & White"
          icon={<Palette className="h-3.5 w-3.5 text-text-sub" />}
          value={visuals.grayscalePercent}
          valueDisplay={
            visuals.grayscalePercent === 0
              ? 'Color'
              : visuals.grayscalePercent === 100
              ? 'Full B&W'
              : `${visuals.grayscalePercent}%`
          }
          min={0}
          max={100}
          step={5}
          leftHint="Color (0%)"
          rightHint="B&W (100%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('grayscalePercent', v)}
        />

        <RangeSliderItem
          label="Sharpness & Text Clarity"
          icon={<Zap className="h-3.5 w-3.5 text-sky-500" />}
          value={visuals.sharpnessPercent}
          valueDisplay={visuals.sharpnessPercent === 0 ? 'Normal' : `+${visuals.sharpnessPercent}%`}
          min={0}
          max={100}
          step={5}
          leftHint="Normal (0%)"
          centerHint="Crisp (50%)"
          rightHint="Ultra (100%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('sharpnessPercent', v)}
        />

        <RangeSliderItem
          label="Color Vibrance & Deep Darks"
          icon={<Sparkles className="h-3.5 w-3.5 text-purple-500" />}
          value={visuals.colorBoostPercent}
          valueDisplay={visuals.colorBoostPercent === 0 ? 'Normal' : `+${visuals.colorBoostPercent}%`}
          min={0}
          max={100}
          step={5}
          leftHint="Normal (0%)"
          centerHint="Deep (50%)"
          rightHint="Max (100%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('colorBoostPercent', v)}
        />

        <RangeSliderItem
          label="Text Boldness & Stroke Width"
          icon={<Bold className="h-3.5 w-3.5 text-slate-800" />}
          value={visuals.textWeightPercent}
          valueDisplay={visuals.textWeightPercent === 0 ? 'Normal' : `+${visuals.textWeightPercent}%`}
          min={0}
          max={100}
          step={5}
          leftHint="Original (0%)"
          centerHint="Medium (50%)"
          rightHint="Thick (100%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('textWeightPercent', v)}
        />

        <RangeSliderItem
          label="Brightness"
          icon={<Sun className="h-3.5 w-3.5 text-amber-500" />}
          value={visuals.brightnessPercent}
          valueDisplay={`${visuals.brightnessPercent}%`}
          min={50}
          max={150}
          step={5}
          leftHint="Darker (50%)"
          centerHint="100%"
          rightHint="Brighter (150%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('brightnessPercent', v)}
        />

        <RangeSliderItem
          label="Contrast"
          icon={<Contrast className="h-3.5 w-3.5 text-blue-600" />}
          value={visuals.contrastPercent}
          valueDisplay={`${visuals.contrastPercent}%`}
          min={50}
          max={200}
          step={5}
          leftHint="Soft (50%)"
          centerHint="100%"
          rightHint="Sharp (200%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('contrastPercent', v)}
        />

        <RangeSliderItem
          label="Saturation"
          icon={<Droplet className="h-3.5 w-3.5 text-rose-500" />}
          value={visuals.saturationPercent}
          valueDisplay={`${visuals.saturationPercent}%`}
          min={0}
          max={200}
          step={5}
          leftHint="Muted (0%)"
          centerHint="100%"
          rightHint="Vivid (200%)"
          disabled={disabled}
          onChange={(v) => onUpdateVisual('saturationPercent', v)}
        />
      </div>
    </Card>
  );
};
