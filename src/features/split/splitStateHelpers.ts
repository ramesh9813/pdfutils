import type { SplitOptions } from '../../types/pdf.types';
import {
  parseRangeString,
  splitPointsToPythonRanges,
  rangesToSplitPoints,
} from './rangeParser';

export function computeToggleSplitPoint(
  prev: SplitOptions,
  pageNumber: number,
  totalPages: number
): { options: SplitOptions; sectionCount: number } {
  const current = prev.splitPoints;
  const nextPoints = current.includes(pageNumber)
    ? current.filter((p) => p !== pageNumber).sort((a, b) => a - b)
    : [...current, pageNumber].sort((a, b) => a - b);

  const pythonRanges = splitPointsToPythonRanges(nextPoints, totalPages);
  const parsed = parseRangeString(pythonRanges, totalPages);
  const sectionCount = parsed.valid ? parsed.ranges.length : 1;

  return {
    options: {
      ...prev,
      mode: 'range',
      splitPoints: nextPoints,
      customRanges: pythonRanges,
      parsedRanges: parsed.valid ? parsed.ranges : prev.parsedRanges,
    },
    sectionCount,
  };
}

export function computeCustomRangesUpdate(
  prev: SplitOptions,
  customRanges: string,
  totalPages?: number
): { options: SplitOptions; sectionCount?: number } {
  let derivedPoints = prev.splitPoints;
  let sectionCount: number | undefined;
  if (totalPages && totalPages > 0) {
    const { valid, ranges } = parseRangeString(customRanges, totalPages);
    if (valid) {
      derivedPoints = rangesToSplitPoints(ranges, totalPages);
      sectionCount = ranges.length;
    }
  }
  return {
    options: { ...prev, customRanges, splitPoints: derivedPoints },
    sectionCount,
  };
}
