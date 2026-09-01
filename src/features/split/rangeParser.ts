import type { SplitRange } from '../../types/pdf.types';

export function splitPointsToPythonRanges(splitPoints: number[], totalPages: number): string {
  if (totalPages <= 0) return '';
  const validPoints = Array.from(new Set(splitPoints))
    .filter((p) => p >= 1 && p < totalPages)
    .sort((a, b) => a - b);

  if (validPoints.length === 0) {
    return `1:${totalPages}`;
  }

  const parts: string[] = [];
  let currentStart = 1;

  for (const splitPoint of validPoints) {
    parts.push(`${currentStart}:${splitPoint}`);
    currentStart = splitPoint + 1;
  }

  if (currentStart <= totalPages) {
    parts.push(`${currentStart}:${totalPages}`);
  }

  return parts.join(', ');
}

export function rangesToSplitPoints(ranges: SplitRange[], totalPages: number): number[] {
  const points: number[] = [];
  for (let i = 0; i < ranges.length - 1; i++) {
    const end = ranges[i].end;
    if (end >= 1 && end < totalPages && !points.includes(end)) {
      points.push(end);
    }
  }
  return points.sort((a, b) => a - b);
}

export function parseRangeString(
  rangeStr: string,
  maxPages: number
): { valid: boolean; ranges: SplitRange[]; error?: string } {
  const trimmed = rangeStr.trim();
  if (!trimmed) {
    return { valid: false, ranges: [], error: 'Range string cannot be empty.' };
  }

  const parts = trimmed.split(',');
  const ranges: SplitRange[] = [];

  for (const part of parts) {
    const segment = part.trim();
    if (!segment) continue;

    let delimiter: ':' | ';' | '-' | null = null;
    if (segment.includes(':')) {
      delimiter = ':';
    } else if (segment.includes(';')) {
      delimiter = ';';
    } else if (segment.includes('-')) {
      delimiter = '-';
    }

    if (delimiter) {
      const tokens = segment.split(delimiter);
      if (tokens.length > 3) {
        return { valid: false, ranges: [], error: `Invalid slice format: "${segment}"` };
      }

      const startRaw = tokens[0]?.trim() ?? '';
      const endRaw = tokens[1]?.trim() ?? '';

      let start = startRaw === '' ? 1 : parseInt(startRaw, 10);
      let end = endRaw === '' ? maxPages : parseInt(endRaw, 10);

      if (start === 0) start = 1;

      if (isNaN(start) || isNaN(end)) {
        return { valid: false, ranges: [], error: `Invalid range format: "${segment}"` };
      }
      if (start < 1 || end < 1) {
        return { valid: false, ranges: [], error: 'Page numbers must be 1 or greater.' };
      }
      if (start > end) {
        return { valid: false, ranges: [], error: `Start page (${start}) cannot exceed end page (${end}).` };
      }
      if (start > maxPages) {
        return { valid: false, ranges: [], error: `Page ${start} exceeds total document pages (${maxPages}).` };
      }

      ranges.push({
        start: start,
        end: Math.min(end, maxPages),
      });
    } else {
      let page = parseInt(segment, 10);
      if (isNaN(page)) {
        return { valid: false, ranges: [], error: `Invalid page number: "${segment}"` };
      }
      if (page === 0) page = 1;
      if (page < 1) {
        return { valid: false, ranges: [], error: 'Page number must be 1 or greater.' };
      }
      if (page > maxPages) {
        return { valid: false, ranges: [], error: `Page ${page} exceeds total document pages (${maxPages}).` };
      }

      ranges.push({ start: page, end: page });
    }
  }

  if (ranges.length === 0) {
    return { valid: false, ranges: [], error: 'No valid ranges found.' };
  }

  return { valid: true, ranges };
}
