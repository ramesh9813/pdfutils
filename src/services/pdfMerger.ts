import { PDFDocument, degrees } from 'pdf-lib';
import type { MergeItem, MergeOptions, MergeOutput } from '../types/pdf.types';
import { parseRangeString } from './pdfSplitter';

export interface MergeAssemblyPage {
  fileId: string;
  fileName: string;
  sourceDocIndex: number;
  pageIndex: number; // 0-indexed in source PDF
  displayPageNumber: number; // 1-indexed in source PDF
  rotationOffset: number;
}

export interface MergeSequenceChunk {
  fileId: string;
  fileName: string;
  pageRangeDisplay: string;
  pageCount: number;
  positionLabel: string;
}

/**
 * Extracts 0-indexed page numbers for a MergeItem based on its pageRange (supporting Python slice syntax).
 */
export function getItemPageIndices(item: MergeItem): number[] {
  if (item.pageRange && item.pageRange.trim() !== '' && item.pageRange.trim().toLowerCase() !== 'all') {
    const { valid, ranges } = parseRangeString(item.pageRange, item.pageCount);
    if (valid && ranges.length > 0) {
      const indices: number[] = [];
      for (const range of ranges) {
        for (let p = range.start; p <= range.end; p++) {
          indices.push(p - 1);
        }
      }
      return indices;
    }
  }
  return Array.from({ length: item.pageCount }, (_, i) => i);
}

/**
 * Assembles the global page order taking into account:
 * - Beginning (prepend)
 * - End (append)
 * - Inside / Middle (insert after page X of target document)
 */
export function buildMergeAssembly(items: MergeItem[]): MergeAssemblyPage[] {
  if (items.length === 0) return [];

  // Helper to get pages for an item
  const getPages = (item: MergeItem, docIndex: number): MergeAssemblyPage[] => {
    const indices = getItemPageIndices(item);
    return indices.map((idx) => ({
      fileId: item.id,
      fileName: item.name,
      sourceDocIndex: docIndex,
      pageIndex: idx,
      displayPageNumber: idx + 1,
      rotationOffset: item.rotationOffset || 0,
    }));
  };

  // Start with the first item
  let assembled: MergeAssemblyPage[] = getPages(items[0], 0);

  // Process subsequent items
  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    const itemPages = getPages(item, i);
    const pos = item.joinPosition || 'end';

    if (pos === 'beginning') {
      // Prepend at the very beginning
      assembled = [...itemPages, ...assembled];
    } else if (pos === 'inside') {
      // Insert inside target document after specified page
      const targetId = item.targetDocumentId || items[0].id;
      const afterPage = Math.max(1, item.insertAfterPage || 1);

      // Find indices in `assembled` that belong to targetId
      const targetMatches: number[] = [];
      for (let aIdx = 0; aIdx < assembled.length; aIdx++) {
        if (assembled[aIdx].fileId === targetId) {
          targetMatches.push(aIdx);
        }
      }

      if (targetMatches.length === 0) {
        // Fallback: append at end
        assembled = [...assembled, ...itemPages];
      } else {
        // Cut point is after the target's N-th page in `assembled`
        const matchIdx = Math.min(afterPage - 1, targetMatches.length - 1);
        const insertPosition = targetMatches[matchIdx] + 1;
        assembled.splice(insertPosition, 0, ...itemPages);
      }
    } else {
      // 'end': append to the current flow
      assembled = [...assembled, ...itemPages];
    }
  }

  return assembled;
}

/**
 * Summarizes the assembled merge flow into contiguous chunks for UI diagram display.
 */
export function buildMergeSequencePlan(items: MergeItem[]): MergeSequenceChunk[] {
  const pages = buildMergeAssembly(items);
  if (pages.length === 0) return [];

  const chunks: MergeSequenceChunk[] = [];
  let currentChunk: {
    fileId: string;
    fileName: string;
    startPage: number;
    endPage: number;
    count: number;
  } | null = null;

  for (const p of pages) {
    if (currentChunk && currentChunk.fileId === p.fileId && p.displayPageNumber === currentChunk.endPage + 1) {
      currentChunk.endPage = p.displayPageNumber;
      currentChunk.count++;
    } else {
      if (currentChunk) {
        chunks.push({
          fileId: currentChunk.fileId,
          fileName: currentChunk.fileName,
          pageRangeDisplay:
            currentChunk.startPage === currentChunk.endPage
              ? `p.${currentChunk.startPage}`
              : `pp. ${currentChunk.startPage}–${currentChunk.endPage}`,
          pageCount: currentChunk.count,
          positionLabel: `Part ${chunks.length + 1}`,
        });
      }
      currentChunk = {
        fileId: p.fileId,
        fileName: p.fileName,
        startPage: p.displayPageNumber,
        endPage: p.displayPageNumber,
        count: 1,
      };
    }
  }

  if (currentChunk) {
    chunks.push({
      fileId: currentChunk.fileId,
      fileName: currentChunk.fileName,
      pageRangeDisplay:
        currentChunk.startPage === currentChunk.endPage
          ? `p.${currentChunk.startPage}`
          : `pp. ${currentChunk.startPage}–${currentChunk.endPage}`,
      pageCount: currentChunk.count,
      positionLabel: `Part ${chunks.length + 1}`,
    });
  }

  return chunks;
}

/**
 * Merges multiple PDF files with support for:
 * - Sequential joining (at end)
 * - Prepended joining (at beginning)
 * - Middle / Inside document insertion (after page X of document Y)
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

  // 1. Load source PDF documents once into memory
  const loadedDocs = new Map<string, PDFDocument>();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    onProgress?.(
      Math.round((i / items.length) * 30),
      100,
      `Loading "${item.name}"...`
    );
    const safeBuffer = item.arrayBuffer.slice(0);
    const doc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
    loadedDocs.set(item.id, doc);
  }

  // 2. Build assembly sequence
  const assemblyPages = buildMergeAssembly(items);
  if (assemblyPages.length === 0) {
    throw new Error('No pages were selected for merging across the provided files.');
  }

  const totalPages = assemblyPages.length;

  // 3. Copy and add pages in the exact assembled order
  for (let i = 0; i < totalPages; i++) {
    const pageItem = assemblyPages[i];
    const srcDoc = loadedDocs.get(pageItem.fileId);
    if (!srcDoc) continue;

    const progressPercent = Math.round(30 + (i / totalPages) * 55);
    onProgress?.(
      progressPercent,
      100,
      `Assembling page ${i + 1} of ${totalPages} (from ${pageItem.fileName})...`
    );

    const [copiedPage] = await mergedPdf.copyPages(srcDoc, [pageItem.pageIndex]);
    if (pageItem.rotationOffset) {
      const currentRot = copiedPage.getRotation().angle;
      const newRot = (currentRot + pageItem.rotationOffset) % 360;
      copiedPage.setRotation(degrees(newRot));
    }
    mergedPdf.addPage(copiedPage);
  }

  onProgress?.(90, 100, 'Generating final merged PDF bytes...');
  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

  const finalName = options.outputFilename.endsWith('.pdf')
    ? options.outputFilename
    : `${options.outputFilename}.pdf`;

  onProgress?.(100, 100, 'Merge complete!');

  return {
    blob,
    filename: finalName,
    totalPages,
    totalFiles: items.length,
  };
}

