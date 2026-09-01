export interface ColorAdjustmentOptions {
  grayscalePercent: number; // 0 to 100 (100 = full B&W)
  brightnessPercent: number; // 50 to 150 (100 = normal)
  contrastPercent: number; // 50 to 200 (100 = normal)
  saturationPercent: number; // 0 to 200 (100 = normal)
  sharpnessPercent: number; // 0 to 100 (0 = normal, 100 = crisp text/edges)
  colorBoostPercent: number; // 0 to 100 (0 = normal, 100 = deepens greens, reds, and darks)
}

export interface ReduceOptions extends ColorAdjustmentOptions {
  qualityPercent: number; // 5 to 100
  targetMb: number; // e.g. 1.5 MB
  originalSize: number; // bytes
}

export interface ReduceResult {
  blob: Blob;
  originalSize: number;
  reducedSize: number;
  percentSaved: number;
  pageCount: number;
}
