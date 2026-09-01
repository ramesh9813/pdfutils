import { PDFDocument } from 'pdf-lib';
import { loadPdfDocument } from '../../services/pdfRenderer';

export interface ReduceOptions {
  qualityPercent: number; // 5 to 100
  targetMb: number; // e.g. 1.5 MB
  originalSize: number; // bytes
}

export interface ReduceResult {
  blob: Blob;
  originalSize: number;
  reducedSize: number;
  percentSaved: number;
  pageCount: number;
}

/**
 * Compresses and optimizes a PDF document by re-sampling embedded pages and rasterizing
 * page canvases at targeted JPEG compression factors and resolutions.
 */
export async function reducePdfSize(
  sourceBuffer: ArrayBuffer,
  options: ReduceOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<ReduceResult> {
  onProgress?.(5, 'Loading source document for analysis...');
  const pdfDocProxy = await loadPdfDocument(sourceBuffer);
  const totalPages = pdfDocProxy.numPages;

  if (totalPages === 0) {
    throw new Error('The PDF document contains no pages.');
  }

  // Calculate resolution scale and JPEG compression factor based on sliders
  const qualityFactor = Math.max(0.08, Math.min(1.0, options.qualityPercent / 100));
  // Scale between 0.5x (aggressive reduction) and 1.6x (maximum quality)
  const renderScale = 0.5 + qualityFactor * 1.0;
  const jpegQuality = Math.max(0.1, Math.min(0.92, qualityFactor * 0.9));

  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= totalPages; i++) {
    const pagePercent = Math.round(10 + ((i - 1) / totalPages) * 75);
    onProgress?.(pagePercent, `Optimizing page ${i} of ${totalPages}...`);

    const page = await pdfDocProxy.getPage(i);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    // Convert canvas to compressed JPEG byte array
    const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const base64Data = dataUrl.split(',')[1];
    const binaryStr = atob(base64Data);
    const jpegBytes = new Uint8Array(binaryStr.length);
    for (let k = 0; k < binaryStr.length; k++) {
      jpegBytes[k] = binaryStr.charCodeAt(k);
    }

    const embeddedImage = await newDoc.embedJpg(jpegBytes);
    const origViewport = page.getViewport({ scale: 1.0 });

    const newPage = newDoc.addPage([origViewport.width, origViewport.height]);
    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: origViewport.width,
      height: origViewport.height,
    });
  }

  pdfDocProxy.destroy();

  onProgress?.(88, 'Serializing optimized PDF bytes...');
  const optimizedBytes = await newDoc.save({ useObjectStreams: true });
  const blob = new Blob([optimizedBytes as unknown as BlobPart], { type: 'application/pdf' });

  const reducedSize = blob.size;
  const savedBytes = Math.max(0, options.originalSize - reducedSize);
  const percentSaved = Math.round((savedBytes / Math.max(1, options.originalSize)) * 100);

  onProgress?.(100, 'Size reduction complete!');

  return {
    blob,
    originalSize: options.originalSize,
    reducedSize,
    percentSaved,
    pageCount: totalPages,
  };
}
