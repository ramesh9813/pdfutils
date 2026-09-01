import type { ColorAdjustmentOptions } from './reduceTypes';

/**
 * Applies visual filters (grayscale/black & white, brightness, contrast, saturation)
 * to a rendered PDF page canvas prior to JPEG compression.
 */
export function applyCanvasFilters(
  sourceCanvas: HTMLCanvasElement,
  options: ColorAdjustmentOptions
): HTMLCanvasElement {
  const {
    grayscalePercent = 0,
    brightnessPercent = 100,
    contrastPercent = 100,
    saturationPercent = 100,
  } = options;

  if (
    grayscalePercent === 0 &&
    brightnessPercent === 100 &&
    contrastPercent === 100 &&
    saturationPercent === 100
  ) {
    return sourceCanvas;
  }

  const filteredCanvas = document.createElement('canvas');
  filteredCanvas.width = sourceCanvas.width;
  filteredCanvas.height = sourceCanvas.height;

  const ctx = filteredCanvas.getContext('2d', { alpha: false });
  if (!ctx) return sourceCanvas;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, filteredCanvas.width, filteredCanvas.height);

  ctx.filter = `grayscale(${grayscalePercent}%) brightness(${brightnessPercent}%) contrast(${contrastPercent}%) saturate(${saturationPercent}%)`;
  ctx.drawImage(sourceCanvas, 0, 0);

  return filteredCanvas;
}
