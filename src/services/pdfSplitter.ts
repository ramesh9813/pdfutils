import { PDFDocument, PDFPage } from 'pdf-lib';
import JSZip from 'jszip';
import type { SplitOptions, SplitOutput, SplitRange } from '../types/pdf.types';

/**
 * Parses and validates user-entered range strings such as "1-3, 5, 7-10".
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

    if (segment.includes('-')) {
      const [startStr, endStr] = segment.split('-');
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);

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
      const page = parseInt(segment, 10);
      if (isNaN(page)) {
        return { valid: false, ranges: [], error: `Invalid page number: "${segment}"` };
      }
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
 * Returns an array of page index arrays (0-indexed) for each target PDF.
 */
export function calculateSplitGroups(
  options: SplitOptions,
  totalDocPages: number
): { name: string; pageIndices: number[] }[] {
  const groups: { name: string; pageIndices: number[] }[] = [];
  const prefix = (options.filenamePrefix || 'document').replace(/\.pdf$/i, '');

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
          pageIndices: sortedPages.map((p) => p - 1),
        });
      } else {
        // Each extracted page in its own separate file
        sortedPages.forEach((pageNum) => {
          groups.push({
            name: `${prefix}-page-${pageNum}.pdf`,
            pageIndices: [pageNum - 1],
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
          pageIndices: [i - 1],
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
          indices.push(p - 1);
        }
        groups.push({
          name: `${prefix}-part-${chunkIndex}_p${start}-p${end}.pdf`,
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
          indices.push(p - 1);
        }
        const rangeName =
          range.start === range.end
            ? `${prefix}-page-${range.start}.pdf`
            : `${prefix}-range-${range.start}-${range.end}.pdf`;

        groups.push({
          name: ranges.length > 1 ? `${idx + 1}_${rangeName}` : rangeName,
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
  onProgress?: (current: number, total: number, message: string) => void
): Promise<SplitOutput> {
  onProgress?.(0, 100, 'Loading source document...');
  const safeBuffer = sourceBuffer.slice(0);
  const srcDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  const groups = calculateSplitGroups(options, totalPages);
  if (groups.length === 0) {
    throw new Error('No pages matched the split criteria.');
  }

  // Single PDF output case
  if (groups.length === 1) {
    onProgress?.(20, 100, `Extracting ${groups[0].pageIndices.length} page(s)...`);
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, groups[0].pageIndices);
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
