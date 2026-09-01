import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PdfPageDetail } from '../types/pdf.types';

// Configure the worker for pdfjs-dist
if (typeof window !== 'undefined' && 'Worker' in window) {
  // Use public worker script
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

/**
 * Loads a PDF document from an ArrayBuffer or Uint8Array.
 */
export async function loadPdfDocument(
  source: ArrayBuffer | Uint8Array
): Promise<PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({
    data: source instanceof Uint8Array ? source : new Uint8Array(source),
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
 * Retrieves the basic geometry and rotation of each page in the PDF.
 */
export async function extractPdfPagesMetadata(
  source: ArrayBuffer | Uint8Array
): Promise<Omit<PdfPageDetail, 'thumbnailUrl'>[]> {
  const doc = await loadPdfDocument(source);
  const pages: Omit<PdfPageDetail, 'thumbnailUrl'>[] = [];

  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      pages.push({
        pageNumber: i,
        width: viewport.width,
        height: viewport.height,
        aspectRatio: viewport.width / viewport.height,
        rotation: viewport.rotation,
      });
    }
  } finally {
    doc.destroy();
  }

  return pages;
}

/**
 * Renders a specific page of a PDF document to a data URL (image/png or image/jpeg).
 * Uses high-DPI scaling for crisp previews while keeping memory light.
 */
export async function renderPageThumbnail(
  source: ArrayBuffer | Uint8Array | PDFDocumentProxy,
  pageNumber: number,
  maxWidth: number = 320,
  rotationOffset: number = 0
): Promise<string> {
  let doc: PDFDocumentProxy;
  let shouldDestroy = false;

  if ('numPages' in source && typeof (source as PDFDocumentProxy).getPage === 'function') {
    doc = source as PDFDocumentProxy;
  } else {
    doc = await loadPdfDocument(source as ArrayBuffer | Uint8Array);
    shouldDestroy = true;
  }

  try {
    const page = await doc.getPage(pageNumber);
    const initialViewport = page.getViewport({ scale: 1.0, rotation: (page.rotate + rotationOffset) % 360 });
    
    // Calculate scale to fit within maxWidth
    const scale = Math.min(maxWidth / initialViewport.width, 2.0);
    const viewport = page.getViewport({ scale, rotation: (page.rotate + rotationOffset) % 360 });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D context not available');
    }

    // Fill white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    if (shouldDestroy) {
      doc.destroy();
    }
  }
}
