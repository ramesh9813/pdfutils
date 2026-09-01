import type { ColorAdjustmentOptions } from './reduceTypes';
import {
  applyColorAndToneBoost,
  applyEdgeSharpen,
  applyTextWeightDilation,
} from './canvasPixelFilters';

/**
 * Applies visual filters (grayscale, brightness, contrast, saturation, sharpness, color boost, and text weight)
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
    sharpnessPercent = 0,
    colorBoostPercent = 0,
    textWeightPercent = 0,
  } = options;

  if (
    grayscalePercent === 0 &&
    brightnessPercent === 100 &&
    contrastPercent === 100 &&
    saturationPercent === 100 &&
    sharpnessPercent === 0 &&
    colorBoostPercent === 0 &&
    textWeightPercent === 0
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

  // 1. Apply global canvas filter (grayscale, brightness, contrast, saturation)
  ctx.filter = `grayscale(${grayscalePercent}%) brightness(${brightnessPercent}%) contrast(${contrastPercent}%) saturate(${saturationPercent}%)`;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.filter = 'none';

  // 2. Apply pixel-level enhancements (deep color boost, edge sharpening, text weight dilation)
  if (sharpnessPercent > 0 || colorBoostPercent > 0 || textWeightPercent > 0) {
    const imgData = ctx.getImageData(0, 0, filteredCanvas.width, filteredCanvas.height);

    if (colorBoostPercent > 0) {
      applyColorAndToneBoost(imgData.data, colorBoostPercent);
    }

    if (sharpnessPercent > 0) {
      const srcCopy = new Uint8ClampedArray(imgData.data);
      applyEdgeSharpen(srcCopy, imgData.data, filteredCanvas.width, filteredCanvas.height, sharpnessPercent);
    }

    if (textWeightPercent > 0) {
      const srcCopy = new Uint8ClampedArray(imgData.data);
      applyTextWeightDilation(srcCopy, imgData.data, filteredCanvas.width, filteredCanvas.height, textWeightPercent);
    }

    ctx.putImageData(imgData, 0, 0);
  }

  return filteredCanvas;
}
