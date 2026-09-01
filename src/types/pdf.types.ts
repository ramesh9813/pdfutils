export interface PdfDocumentInfo {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  file: File;
  arrayBuffer: ArrayBuffer;
}

export interface PdfPageDetail {
  pageNumber: number; // 1-indexed (current sequence position)
  originalPageIndex: number; // 0-indexed original page index in source PDF
  width: number;
  height: number;
  aspectRatio: number;
  rotation: number;
  thumbnailUrl?: string;
  isLoadingThumbnail?: boolean;
}

export type SplitMode = 'extract' | 'range' | 'single' | 'every_n';

export interface SplitRange {
  start: number;
  end: number;
}

export interface SplitOptions {
  mode: SplitMode;
  selectedPages: number[]; // 1-indexed page numbers
  splitPoints: number[]; // 1-indexed page numbers where split cut occurs
  customRanges: string; // e.g. "1:5, 6:9, 10:50, 51:67" (Python-based indexing)
  parsedRanges: SplitRange[];
  everyN: number;
  mergeExtracted: boolean; // if true in extract mode, returns 1 merged PDF; if false, zipped files
  filenamePrefix: string;
}

export type ProcessingStatus = 
  | 'idle'
  | 'parsing'
  | 'rendering'
  | 'processing'
  | 'zipping'
  | 'completed'
  | 'error';

export interface ProgressState {
  status: ProcessingStatus;
  current: number;
  total: number;
  message: string;
  error?: string;
}

export interface SplitOutput {
  blob: Blob;
  filename: string;
  fileCount: number;
  isZip: boolean;
}

export type JoinPosition = 'end' | 'beginning' | 'inside';

export interface MergeItem {
  id: string;
  file: File;
  arrayBuffer: ArrayBuffer;
  name: string;
  size: number;
  pageCount: number;
  thumbnailUrl?: string;
  pageRange?: string; // "all" or e.g. "1:3"
  rotationOffset?: number; // 0, 90, 180, 270
  joinPosition?: JoinPosition; // 'end' | 'beginning' | 'inside'
  targetDocumentId?: string; // document id to insert inside
  insertAfterPage?: number; // 1-indexed page of target document to insert after
}

export interface MergeOptions {
  outputFilename: string;
}

export interface MergeOutput {
  blob: Blob;
  filename: string;
  totalPages: number;
  totalFiles: number;
}
