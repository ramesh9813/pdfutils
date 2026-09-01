import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import type { SplitOptions, SplitOutput } from '../../types/pdf.types';
import { parseRangeString } from './rangeParser';

export interface SplitFileItem {
  blob: Blob;
  filename: string;
  pageCount: number;
}

export function calculateSplitGroups(
  options: SplitOptions,
  totalPages: number,
  pageOrderMapping?: number[],
  selectedSectionIndices?: number[]
): { filenameSuffix: string; pageIndices: number[] }[] {
  const getOrigIdx = (pNum: number): number => {
    const zeroIdx = pNum - 1;
    return pageOrderMapping && zeroIdx < pageOrderMapping.length
      ? pageOrderMapping[zeroIdx]
      : zeroIdx;
  };

  switch (options.mode) {
    case 'single':
      return Array.from({ length: totalPages }, (_, i) => ({
        filenameSuffix: `page_${i + 1}`,
        pageIndices: [getOrigIdx(i + 1)],
      }));

    case 'extract': {
      if (options.selectedPages.length === 0) return [];
      const sorted = [...options.selectedPages].sort((a, b) => a - b);
      if (options.mergeExtracted) {
        return [{
          filenameSuffix: 'extracted',
          pageIndices: sorted.map((p) => getOrigIdx(p)),
        }];
      }
      return sorted.map((p) => ({
        filenameSuffix: `page_${p}`,
        pageIndices: [getOrigIdx(p)],
      }));
    }

    case 'range': {
      const { valid, ranges } = parseRangeString(options.customRanges, totalPages);
      if (!valid || ranges.length === 0) return [];
      
      const allSections = ranges.map((r, idx) => {
        const indices: number[] = [];
        for (let p = r.start; p <= r.end; p++) {
          indices.push(getOrigIdx(p));
        }
        return {
          filenameSuffix: `part_${idx + 1}_p${r.start}-${r.end}`,
          pageIndices: indices,
        };
      });

      // Filter by selectedSectionIndices if specified
      if (selectedSectionIndices && selectedSectionIndices.length > 0) {
        return allSections.filter((_, idx) => selectedSectionIndices.includes(idx));
      }
      return allSections;
    }

    case 'every_n': {
      const n = Math.max(1, options.everyN || 1);
      const groups: { filenameSuffix: string; pageIndices: number[] }[] = [];
      let part = 1;
      for (let i = 1; i <= totalPages; i += n) {
        const end = Math.min(i + n - 1, totalPages);
        const indices: number[] = [];
        for (let p = i; p <= end; p++) {
          indices.push(getOrigIdx(p));
        }
        groups.push({
          filenameSuffix: `part_${part}_p${i}-${end}`,
          pageIndices: indices,
        });
        part++;
      }
      return groups;
    }
  }
}

export async function splitPdf(
  sourceBuffer: ArrayBuffer,
  options: SplitOptions,
  totalPages: number,
  onProgress?: (current: number, total: number, message: string) => void,
  pageOrderMapping?: number[],
  pageRotations?: { [originalIndex: number]: number },
  selectedSectionIndices?: number[]
): Promise<SplitOutput> {
  const groups = calculateSplitGroups(options, totalPages, pageOrderMapping, selectedSectionIndices);
  if (groups.length === 0) {
    throw new Error('No pages or sections were selected for splitting.');
  }

  const safeBuffer = sourceBuffer.slice(0);
  const srcDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
  const baseName = options.filenamePrefix.replace(/\.pdf$/i, '');
  const items: SplitFileItem[] = [];
  const total = groups.length;

  for (let i = 0; i < total; i++) {
    const group = groups[i];
    onProgress?.(i + 1, total, `Building part ${i + 1} of ${total}...`);

    const splitDoc = await PDFDocument.create();
    splitDoc.setTitle(`${baseName} - ${group.filenameSuffix}`);
    const copiedPages = await splitDoc.copyPages(srcDoc, group.pageIndices);

    copiedPages.forEach((page, pIdx) => {
      const origIdx = group.pageIndices[pIdx];
      const extraRot = pageRotations ? pageRotations[origIdx] || 0 : 0;
      if (extraRot) {
        const cur = page.getRotation().angle;
        page.setRotation(degrees((cur + extraRot) % 360));
      }
      splitDoc.addPage(page);
    });

    const pdfBytes = await splitDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const filename = `${baseName}_${group.filenameSuffix}.pdf`;

    items.push({
      blob,
      filename,
      pageCount: group.pageIndices.length,
    });
  }

  if (items.length === 1) {
    return {
      blob: items[0].blob,
      filename: items[0].filename,
      fileCount: 1,
      isZip: false,
    };
  }

  onProgress?.(total, total, 'Creating ZIP archive...');
  const zip = new JSZip();
  items.forEach((item) => {
    zip.file(item.filename, item.blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return {
    blob: zipBlob,
    filename: `${baseName}_split.zip`,
    fileCount: items.length,
    isZip: true,
  };
}
