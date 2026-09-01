import type { MergeItem } from '../../types/pdf.types';
import { parseRangeString } from '../split/rangeParser';

export interface MergeAssemblyPage {
  fileId: string;
  fileName: string;
  sourceDocIndex: number;
  pageIndex: number;
  displayPageNumber: number;
  rotationOffset: number;
}

export interface MergeSequenceChunk {
  fileId: string;
  fileName: string;
  pageRangeDisplay: string;
  pageCount: number;
  positionLabel: string;
}

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

export function buildMergeAssembly(items: MergeItem[]): MergeAssemblyPage[] {
  if (items.length === 0) return [];

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

  let assembled: MergeAssemblyPage[] = getPages(items[0], 0);

  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    const itemPages = getPages(item, i);
    const pos = item.joinPosition || 'end';

    if (pos === 'beginning') {
      assembled = [...itemPages, ...assembled];
    } else if (pos === 'inside') {
      const targetId = item.targetDocumentId || items[0].id;
      const afterPage = Math.max(1, item.insertAfterPage || 1);

      const targetMatches: number[] = [];
      for (let aIdx = 0; aIdx < assembled.length; aIdx++) {
        if (assembled[aIdx].fileId === targetId) {
          targetMatches.push(aIdx);
        }
      }

      if (targetMatches.length === 0) {
        assembled = [...assembled, ...itemPages];
      } else {
        const matchIdx = Math.min(afterPage - 1, targetMatches.length - 1);
        const insertPosition = targetMatches[matchIdx] + 1;
        assembled.splice(insertPosition, 0, ...itemPages);
      }
    } else {
      assembled = [...assembled, ...itemPages];
    }
  }

  return assembled;
}

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
