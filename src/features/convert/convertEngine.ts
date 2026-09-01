import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { loadPdfDocument } from '../../services/pdfRenderer';
import type { ConvertResult } from './convertTypes';

export async function convertPdfToImages(
  fileBuffer: ArrayBuffer,
  toFormat: 'jpg' | 'png' | 'webp',
  baseName: string,
  onProgress?: (pct: number) => void
): Promise<ConvertResult> {
  const doc = await loadPdfDocument(fileBuffer);
  const total = doc.numPages;
  const mimeType = toFormat === 'png' ? 'image/png' : toFormat === 'webp' ? 'image/webp' : 'image/jpeg';
  const ext = toFormat === 'jpg' ? 'jpg' : toFormat;

  const pageBlobs: { name: string; blob: Blob }[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mimeType, 0.92)
      );

      if (blob) {
        pageBlobs.push({ name: `page_${i}.${ext}`, blob });
      }
    }
    if (onProgress) onProgress(Math.round((i / total) * 95));
  }

  doc.destroy();

  if (pageBlobs.length === 1) {
    return {
      blob: pageBlobs[0].blob,
      filename: `${baseName}_page1.${ext}`,
      count: 1,
    };
  }

  const zip = new JSZip();
  pageBlobs.forEach((p) => zip.file(p.name, p.blob));
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  return {
    blob: zipBlob,
    filename: `${baseName}_${ext}.zip`,
    count: pageBlobs.length,
  };
}

export async function convertPdfToText(
  fileBuffer: ArrayBuffer,
  baseName: string
): Promise<ConvertResult> {
  const doc = await loadPdfDocument(fileBuffer);
  let fullText = '';

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await (page as any).getTextContent();
    const pageText = content.items
      .map((item: any) => item.str || '')
      .join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  doc.destroy();

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  return {
    blob,
    filename: `${baseName}.txt`,
    count: 1,
  };
}

export async function convertImagesToPdf(
  files: File[],
  onProgress?: (pct: number) => void
): Promise<ConvertResult> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const isPng = file.type === 'image/png' || file.name.endsWith('.png');

    const image = isPng
      ? await pdfDoc.embedPng(bytes)
      : await pdfDoc.embedJpg(bytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 95));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const baseName = files[0].name.replace(/\.[^.]+$/, '');

  return {
    blob,
    filename: `${baseName}_converted.pdf`,
    count: files.length,
  };
}
