import { PDFDocument, degrees } from 'pdf-lib';
import type { MergeItem, MergeOptions, MergeOutput } from '../types/pdf.types';
import { parseRangeString } from './pdfSplitter';

/**
 * Merges multiple PDF files in the specified order into a single unified PDF document.
 */
export async function mergePdfs(
  items: MergeItem[],
  options: MergeOptions,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<MergeOutput> {
  if (items.length < 2) {
    throw new Error('At least two PDF documents are required to perform a merge.');
  }

  onProgress?.(0, 100, 'Initializing merge engine...');
  const mergedPdf = await PDFDocument.create();
  mergedPdf.setTitle(options.outputFilename || 'merged-document.pdf');
  mergedPdf.setProducer('PDFUtils Client-Side Engine');

  let totalPagesMerged = 0;
  const totalFiles = items.length;

  for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
    const item = items[fileIndex];
    const baseProgress = Math.round((fileIndex / totalFiles) * 85);
    onProgress?.(
      baseProgress,
      100,
      `Processing "${item.name}" (${fileIndex + 1}/${totalFiles})...`
    );

    const safeBuffer = item.arrayBuffer.slice(0);
    const sourceDoc = await PDFDocument.load(safeBuffer, {
      ignoreEncryption: false,
    });
    const docPageCount = sourceDoc.getPageCount();

    // Determine which page indices to include from this file
    let pageIndices: number[] = [];

    if (item.pageRange && item.pageRange.trim() !== '' && item.pageRange.trim().toLowerCase() !== 'all') {
      const { valid, ranges, error } = parseRangeString(item.pageRange, docPageCount);
      if (!valid) {
        throw new Error(`Invalid page range for "${item.name}": ${error}`);
      }
      for (const range of ranges) {
        for (let p = range.start; p <= range.end; p++) {
          pageIndices.push(p - 1);
        }
      }
    } else {
      // Include all pages
      pageIndices = Array.from({ length: docPageCount }, (_, i) => i);
    }

    if (pageIndices.length === 0) {
      continue;
    }

    // Copy selected pages
    const copiedPages = await mergedPdf.copyPages(sourceDoc, pageIndices);

    for (const page of copiedPages) {
      if (item.rotationOffset) {
        const currentRot = page.getRotation().angle;
        const newRot = (currentRot + item.rotationOffset) % 360;
        page.setRotation(degrees(newRot));
      }
      mergedPdf.addPage(page);
      totalPagesMerged++;
    }
  }

  if (totalPagesMerged === 0) {
    throw new Error('No pages were selected for merging across the provided files.');
  }

  onProgress?.(90, 100, 'Generating final document bytes...');
  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

  const finalName = options.outputFilename.endsWith('.pdf')
    ? options.outputFilename
    : `${options.outputFilename}.pdf`;

  onProgress?.(100, 100, 'Merge complete!');

  return {
    blob,
    filename: finalName,
    totalPages: totalPagesMerged,
    totalFiles,
  };
}
