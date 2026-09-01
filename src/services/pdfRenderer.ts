import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import type { PdfPageDetail } from '../types/pdf.types';

// Configure worker using Vite asset URL with public worker fallback
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl || '/pdf.worker.min.js';
}

/**
 * Creates a safely isolated clone of the Uint8Array buffer
 * so that PDF.js worker transfers will NEVER detach the original ArrayBuffer.
 */
function createSafeBufferCopy(source: ArrayBuffer | Uint8Array): Uint8Array {
  const view = source instanceof Uint8Array ? source : new Uint8Array(source);
  const copy = new Uint8Array(view.length);
  copy.set(view);
  return copy;
}

/**
 * Loads a PDF document from an ArrayBuffer or Uint8Array.
 * Always works on an isolated copy so the original buffer is untouched.
 */
export async function loadPdfDocument(
  source: ArrayBuffer | Uint8Array
): Promise<PDFDocumentProxy> {
  const safeData = createSafeBufferCopy(source);

  const loadingTask = pdfjsLib.getDocument({
    data: safeData,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  });

  return await loadingTask.promise;
}

/**
 * Gets the total number of pages from a PDF buffer.
 */
export async function getPdfPageCount(
  source: ArrayBuffer | Uint8Array
): Promise<number> {
  const doc = await loadPdfDocument(source);
  const count = doc.numPages;
  doc.destroy();
  return count;
}

/**
 * Renders a specific page directly from an active PDFDocumentProxy.
 */
export async function renderPageThumbnailFromDoc(
  doc: PDFDocumentProxy,
  pageNumber: number,
  maxWidth: number = 320,
  rotationOffset: number = 0
): Promise<string> {
  const page = await doc.getPage(pageNumber);
  const totalRotation = (page.rotate + rotationOffset) % 360;
  const initialViewport = page.getViewport({ scale: 1.0, rotation: totalRotation });

  // Compute crisp scale within maxWidth
  const scale = Math.min(maxWidth / initialViewport.width, 2.0);
  const viewport = page.getViewport({ scale, rotation: totalRotation });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Canvas 2D rendering context not available');
  }

  // Fill white canvas background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Loads the document once and streams all page metadata and thumbnail renders
 * progressively without creating multiple document proxies or detaching caller buffers.
 */
export async function extractDocumentWithThumbnails(
  source: ArrayBuffer | Uint8Array,
  maxWidth: number = 280,
  onThumbnailReady?: (pageNumber: number, thumbnailUrl: string) => void,
  signal?: AbortSignal
): Promise<PdfPageDetail[]> {
  const doc = await loadPdfDocument(source);
  const pages: PdfPageDetail[] = [];

  try {
    const numPages = doc.numPages;

    // 1. Quick initial pass to gather dimensions & structure
    for (let i = 1; i <= numPages; i++) {
      if (signal?.aborted) break;
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });

      pages.push({
        pageNumber: i,
        width: viewport.width,
        height: viewport.height,
        aspectRatio: viewport.width / viewport.height,
        rotation: viewport.rotation,
        isLoadingThumbnail: true,
      });
    }

    // 2. Progressive thumbnail rendering pass
    for (let i = 1; i <= numPages; i++) {
      if (signal?.aborted) break;

      try {
        const thumbUrl = await renderPageThumbnailFromDoc(doc, i, maxWidth);
        pages[i - 1].thumbnailUrl = thumbUrl;
        pages[i - 1].isLoadingThumbnail = false;
        onThumbnailReady?.(i, thumbUrl);
      } catch (renderErr) {
        console.error(`Failed to render thumbnail for page ${i}:`, renderErr);
        pages[i - 1].isLoadingThumbnail = false;
      }
    }
  } finally {
    doc.destroy();
  }

  return pages;
}

/**
 * Fallback standalone renderer for a single page thumbnail (e.g. for re-rendering upon rotation).
 */
export async function renderPageThumbnail(
  source: ArrayBuffer | Uint8Array,
  pageNumber: number,
  maxWidth: number = 320,
  rotationOffset: number = 0
): Promise<string> {
  const doc = await loadPdfDocument(source);
  try {
    return await renderPageThumbnailFromDoc(doc, pageNumber, maxWidth, rotationOffset);
  } finally {
    doc.destroy();
  }
}
