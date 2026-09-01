import { PDFDocument, PDFPage, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import type { SplitOptions, SplitOutput, SplitRange } from '../types/pdf.types';

/**
 * Converts split points into Python-based colon range string.
 * Example: Split points [5, 9, 50] for a 100-page doc becomes:
 * "1:5, 6:9, 10:50, 51:100" (5 split points yield 6 parts).
 */
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

/**
 * Derives split points from parsed SplitRanges.
 * Returns the cut end-points (excluding the last page if it equals totalPages).
 */
export function rangesToSplitPoints(ranges: SplitRange[], totalPages: number): number[] {
  const points: number[] = [];
  for (const r of ranges) {
    if (r.end >= 1 && r.end < totalPages) {
      points.push(r.end);
    }
  }
  return Array.from(new Set(points)).sort((a, b) => a - b);
}

/**
 * Parses and validates user-entered range strings supporting Python-based indexing (e.g. "1:5, 6:9"),
 * semicolon typos (e.g. "1;5"), open slices (e.g. ":5", "10:"), single pages ("5"), and traditional dashes ("1-5").
 */
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

    // Detect delimiter: colon ':', semicolon ';', or dash '-'
    let delimiter: string | null = null;
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

      // Support open slices like ":5" -> 1 to 5, or "50:" -> 50 to maxPages
      let start = startRaw === '' ? 1 : parseInt(startRaw, 10);
      let end = endRaw === '' ? maxPages : parseInt(endRaw, 10);

      // Handle Python 0-based index gracefully (e.g. 0:5 means first 5 pages, so pages 1..5)
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

/**
 * Calculates the split plan based on SplitOptions and total page count.
 * Accepts optional pageOrderMapping (mapping 0-indexed display position to original 0-indexed page index).
 * Returns an array of page index arrays (0-indexed) for each target PDF.
 */
export function calculateSplitGroups(
  options: SplitOptions,
  totalDocPages: number,
  pageOrderMapping?: number[]
): { name: string; pageIndices: number[] }[] {
  const groups: { name: string; pageIndices: number[] }[] = [];
  const prefix = (options.filenamePrefix || 'document').replace(/\.pdf$/i, '');

  const mapDisplayToOriginal = (displayPageNum: number): number => {
    if (pageOrderMapping && pageOrderMapping[displayPageNum - 1] !== undefined) {
      return pageOrderMapping[displayPageNum - 1];
    }
    return displayPageNum - 1;
  };

  switch (options.mode) {
    case 'extract': {
      const sortedPages = [...new Set(options.selectedPages)].sort((a, b) => a - b);
      if (sortedPages.length === 0) {
        throw new Error('Please select at least one page to extract.');
      }

      if (options.mergeExtracted) {
        // All extracted pages combined into 1 single PDF
        groups.push({
          name: `${prefix}-extracted.pdf`,
          pageIndices: sortedPages.map(mapDisplayToOriginal),
        });
      } else {
        // Each extracted page in its own separate file
        sortedPages.forEach((pageNum) => {
          groups.push({
            name: `${prefix}-page-${pageNum}.pdf`,
            pageIndices: [mapDisplayToOriginal(pageNum)],
          });
        });
      }
      break;
    }

    case 'single': {
      // Every single page in its own file
      for (let i = 1; i <= totalDocPages; i++) {
        groups.push({
          name: `${prefix}-page-${i}.pdf`,
          pageIndices: [mapDisplayToOriginal(i)],
        });
      }
      break;
    }

    case 'every_n': {
      const step = Math.max(1, options.everyN || 1);
      let chunkIndex = 1;
      for (let i = 1; i <= totalDocPages; i += step) {
        const start = i;
        const end = Math.min(i + step - 1, totalDocPages);
        const indices: number[] = [];
        for (let p = start; p <= end; p++) {
          indices.push(mapDisplayToOriginal(p));
        }
        groups.push({
          name: `${prefix}-part-${chunkIndex}_p${start}-${end}.pdf`,
          pageIndices: indices,
        });
        chunkIndex++;
      }
      break;
    }

    case 'range': {
      const { valid, ranges, error } = parseRangeString(options.customRanges, totalDocPages);
      if (!valid) {
        throw new Error(error || 'Invalid range configuration');
      }

      ranges.forEach((range, idx) => {
        const indices: number[] = [];
        for (let p = range.start; p <= range.end; p++) {
          indices.push(mapDisplayToOriginal(p));
        }
        const rangeName =
          range.start === range.end
            ? `${prefix}-page-${range.start}.pdf`
            : `${prefix}-part-${idx + 1}_p${range.start}-${range.end}.pdf`;

        groups.push({
          name: rangeName,
          pageIndices: indices,
        });
      });
      break;
    }
  }

  return groups;
}

/**
 * Splits a PDF according to the given options.
 * If 1 file is generated, returns a PDF Blob.
 * If multiple files are generated, packages them into a JSZip archive and returns a ZIP Blob.
 */
export async function splitPdf(
  sourceBuffer: ArrayBuffer,
  options: SplitOptions,
  onProgress?: (current: number, total: number, message: string) => void,
  pageOrderMapping?: number[],
  pageRotations?: { [originalIndex: number]: number }
): Promise<SplitOutput> {
  onProgress?.(0, 100, 'Loading source document...');
  const safeBuffer = sourceBuffer.slice(0);
  const srcDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  const groups = calculateSplitGroups(options, totalPages, pageOrderMapping);
  if (groups.length === 0) {
    throw new Error('No pages matched the split criteria.');
  }

  // Helper to apply rotation to copied pages
  const applyRotations = (pages: PDFPage[], originalIndices: number[]) => {
    if (!pageRotations) return;
    pages.forEach((page, i) => {
      const origIdx = originalIndices[i];
      const extraRot = pageRotations[origIdx];
      if (extraRot) {
        const currentRot = page.getRotation().angle;
        page.setRotation(degrees((currentRot + extraRot) % 360));
      }
    });
  };

  // Single PDF output case
  if (groups.length === 1) {
    onProgress?.(20, 100, `Extracting ${groups[0].pageIndices.length} page(s)...`);
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, groups[0].pageIndices);
    applyRotations(copiedPages, groups[0].pageIndices);
    copiedPages.forEach((page: PDFPage) => newDoc.addPage(page));

    onProgress?.(80, 100, 'Serializing PDF bytes...');
    const pdfBytes = await newDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

    onProgress?.(100, 100, 'Complete!');
    return {
      blob,
      filename: groups[0].name,
      fileCount: 1,
      isZip: false,
    };
  }

  // Multiple files output: package into a ZIP
  const zip = new JSZip();
  const totalGroups = groups.length;

  for (let i = 0; i < totalGroups; i++) {
    const group = groups[i];
    const progressPercent = Math.round(10 + (i / totalGroups) * 70);
    onProgress?.(
      progressPercent,
      100,
      `Creating ${group.name} (${i + 1}/${totalGroups})...`
    );

    const subDoc = await PDFDocument.create();
    const copiedPages = await subDoc.copyPages(srcDoc, group.pageIndices);
    applyRotations(copiedPages, group.pageIndices);
    copiedPages.forEach((page: PDFPage) => subDoc.addPage(page));

    const subBytes = await subDoc.save();
    zip.file(group.name, subBytes);
  }

  onProgress?.(85, 100, 'Compiling ZIP archive...');
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      const zipProgress = Math.round(85 + (metadata.percent / 100) * 15);
      onProgress?.(zipProgress, 100, `Archiving: ${Math.round(metadata.percent)}%`);
    }
  );

  const prefix = (options.filenamePrefix || 'document').replace(/\.pdf$/i, '');
  const zipFilename = `${prefix}-split-archive.zip`;

  onProgress?.(100, 100, 'Complete!');
  return {
    blob: zipBlob,
    filename: zipFilename,
    fileCount: totalGroups,
    isZip: true,
  };
}
