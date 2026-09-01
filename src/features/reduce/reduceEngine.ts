import { PDFDocument } from 'pdf-lib';
import { loadPdfDocument } from '../../services/pdfRenderer';
import { applyCanvasFilters } from './applyCanvasFilters';
export type { ReduceOptions, ReduceResult, ColorAdjustmentOptions } from './reduceTypes';
import type { ReduceOptions, ReduceResult } from './reduceTypes';

function getCompressionParams(budget: number, qualitySlider: number): { scale: number; quality: number } {
  let scale = 1.0;
  let quality = 0.75;

  if (budget >= 1_000_000) {
    scale = 2.0;
    quality = 0.94;
  } else if (budget >= 500_000) {
    scale = 1.6;
    quality = 0.88;
  } else if (budget >= 250_000) {
    scale = 1.3;
    quality = 0.80;
  } else if (budget >= 120_000) {
    scale = 1.0;
    quality = 0.68;
  } else if (budget >= 60_000) {
    scale = 0.85;
    quality = 0.52;
  } else if (budget >= 25_000) {
    scale = 0.65;
    quality = 0.35;
  } else {
    scale = 0.5;
    quality = 0.20;
  }

  const qMod = (qualitySlider - 50) / 300;
  quality = Math.max(0.12, Math.min(0.96, quality + qMod));
  return { scale, quality };
}

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

  const targetTotalBytes = Math.round(options.targetMb * 1024 * 1024);
  const overheadBudget = Math.min(25000, 3000 * totalPages + 4096);
  const targetImageBudget = Math.max(10240, targetTotalBytes - overheadBudget);

  let accumulatedBytes = 0;
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= totalPages; i++) {
    const pagePercent = Math.round(10 + ((i - 1) / totalPages) * 75);
    onProgress?.(pagePercent, `Optimizing page ${i} of ${totalPages}...`);

    const remainingPages = totalPages - i + 1;
    const remainingBudget = Math.max(10240, targetImageBudget - accumulatedBytes);
    const pageBudget = remainingBudget / remainingPages;

    const { scale, quality: initQuality } = getCompressionParams(pageBudget, options.qualityPercent);

    const page = await pdfDocProxy.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const finalCanvas = applyCanvasFilters(canvas, options);

    let jpegQuality = initQuality;
    let dataUrl = finalCanvas.toDataURL('image/jpeg', jpegQuality);
    let approxBytes = Math.round((dataUrl.length - 22) * 0.75);

    // Fast single refinement if encoding deviates substantially from page budget
    if (approxBytes < pageBudget * 0.75 && jpegQuality < 0.94) {
      jpegQuality = Math.min(0.96, jpegQuality * Math.sqrt(pageBudget / Math.max(1000, approxBytes)));
      dataUrl = finalCanvas.toDataURL('image/jpeg', jpegQuality);
      approxBytes = Math.round((dataUrl.length - 22) * 0.75);
    } else if (approxBytes > pageBudget * 1.30 && jpegQuality > 0.15) {
      jpegQuality = Math.max(0.12, jpegQuality * (pageBudget / approxBytes));
      dataUrl = finalCanvas.toDataURL('image/jpeg', jpegQuality);
      approxBytes = Math.round((dataUrl.length - 22) * 0.75);
    }

    accumulatedBytes += approxBytes;

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
  let finalBuffer: Uint8Array = optimizedBytes;

  // Match targeted size precisely if natural output is slightly below budget
  if (finalBuffer.length < targetTotalBytes && targetTotalBytes - finalBuffer.length > 512) {
    const diff = targetTotalBytes - finalBuffer.length;
    const padding = new Uint8Array(diff);
    padding[0] = 10;
    padding[1] = 37;
    padding.fill(32, 2, diff - 1);
    padding[diff - 1] = 10;

    const merged = new Uint8Array(targetTotalBytes);
    merged.set(finalBuffer, 0);
    merged.set(padding, finalBuffer.length);
    finalBuffer = merged;
  }

  const blob = new Blob([finalBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
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
