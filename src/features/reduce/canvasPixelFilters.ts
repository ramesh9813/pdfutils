/**
 * Applies dynamic color vibrance & deep tone boost to canvas pixel data.
 * - Prominent colors become richer (redder reds, greener greens, bluer blues).
 * - Darks/shadows become deeper and darker while paper background remains bright.
 */
export function applyColorAndToneBoost(
  data: Uint8ClampedArray,
  colorBoostPercent: number
): void {
  if (colorBoostPercent <= 0) return;
  const boost = colorBoostPercent / 100;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let nr = r;
    let ng = g;
    let nb = b;

    // Color boost: amplify dominant chromatic channel
    if (delta > 8) {
      nr = r + (r - lum) * boost * 1.3;
      ng = g + (g - lum) * boost * 1.3;
      nb = b + (b - lum) * boost * 1.3;
    }

    // Deepen darks: intensifies dark text & shadow levels
    if (lum < 145) {
      const darkRatio = (145 - lum) / 145;
      const mult = 1 - boost * 0.45 * darkRatio;
      nr *= mult;
      ng *= mult;
      nb *= mult;
    }

    data[i] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
    data[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
    data[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
  }
}

/**
 * Applies unsharp edge enhancement to sharpen text boundaries and eliminate scan blur.
 */
export function applyEdgeSharpen(
  srcData: Uint8ClampedArray,
  dstData: Uint8ClampedArray,
  width: number,
  height: number,
  sharpnessPercent: number
): void {
  if (sharpnessPercent <= 0) return;
  const strength = (sharpnessPercent / 100) * 0.65;
  const centerWeight = 1 + 4 * strength;

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width * 4;
    const prevRowOffset = (y - 1) * width * 4;
    const nextRowOffset = (y + 1) * width * 4;

    for (let x = 1; x < width - 1; x++) {
      const idx = rowOffset + x * 4;
      const topIdx = prevRowOffset + x * 4;
      const bottomIdx = nextRowOffset + x * 4;
      const leftIdx = idx - 4;
      const rightIdx = idx + 4;

      for (let c = 0; c < 3; c++) {
        const val =
          srcData[idx + c] * centerWeight -
          (srcData[topIdx + c] +
            srcData[bottomIdx + c] +
            srcData[leftIdx + c] +
            srcData[rightIdx + c]) *
            strength;

        dstData[idx + c] = val < 0 ? 0 : val > 255 ? 255 : val;
      }
    }
  }
}

/**
 * Morphological dark dilation: detects dark text character strokes and lines,
 * and expands their physical width/weight into adjacent pixels.
 */
export function applyTextWeightDilation(
  srcData: Uint8ClampedArray,
  dstData: Uint8ClampedArray,
  width: number,
  height: number,
  textWeightPercent: number
): void {
  if (textWeightPercent <= 0) return;
  const strength = (textWeightPercent / 100) * 0.9;
  const darkThreshold = 150;

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width * 4;
    const prevRowOffset = (y - 1) * width * 4;
    const nextRowOffset = (y + 1) * width * 4;

    for (let x = 1; x < width - 1; x++) {
      const idx = rowOffset + x * 4;
      const r = srcData[idx];
      const g = srcData[idx + 1];
      const b = srcData[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      const topIdx = prevRowOffset + x * 4;
      const botIdx = nextRowOffset + x * 4;
      const leftIdx = idx - 4;
      const rightIdx = idx + 4;

      const lumTop = 0.299 * srcData[topIdx] + 0.587 * srcData[topIdx + 1] + 0.114 * srcData[topIdx + 2];
      const lumBot = 0.299 * srcData[botIdx] + 0.587 * srcData[botIdx + 1] + 0.114 * srcData[botIdx + 2];
      const lumLeft = 0.299 * srcData[leftIdx] + 0.587 * srcData[leftIdx + 1] + 0.114 * srcData[leftIdx + 2];
      const lumRight = 0.299 * srcData[rightIdx] + 0.587 * srcData[rightIdx + 1] + 0.114 * srcData[rightIdx + 2];

      const minNeighborLum = Math.min(lumTop, lumBot, lumLeft, lumRight);

      // If an adjacent neighbor is dark text/stroke, expand darkness into current pixel
      if (minNeighborLum < darkThreshold && minNeighborLum < lum) {
        const darkDiff = lum - minNeighborLum;
        const blend = strength * (darkDiff / 255);
        dstData[idx] = Math.max(0, r * (1 - blend) + minNeighborLum * blend);
        dstData[idx + 1] = Math.max(0, g * (1 - blend) + minNeighborLum * blend);
        dstData[idx + 2] = Math.max(0, b * (1 - blend) + minNeighborLum * blend);
      }
    }
  }
}
