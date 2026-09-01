import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { loadPdfDocument } from '../../services/pdfRenderer';
import { generateDocx, extractTextFromDocx } from './docxGenerator';
import { convertTextToPdf } from './textToPdf';
import { extractPdfToText, extractPdfToMarkdown, extractPdfToCsv } from './pdfExtractors';
import type { SourceFormat, TargetFormat, ConvertResult } from './convertTypes';

export async function convertPdfToImages(
  fileBuffer: ArrayBuffer,
  toFormat: 'jpg' | 'png',
  baseName: string,
  onProgress?: (pct: number) => void
): Promise<ConvertResult> {
  const doc = await loadPdfDocument(fileBuffer);
  const total = doc.numPages;
  const mimeType = toFormat === 'png' ? 'image/png' : 'image/jpeg';
  const ext = toFormat;
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
      if (blob) pageBlobs.push({ name: `${baseName}_page_${i}.${ext}`, blob });
    }
    if (onProgress) onProgress(Math.round((i / total) * 90));
  }
  doc.destroy();

  if (pageBlobs.length === 1) {
    return { blob: pageBlobs[0].blob, filename: pageBlobs[0].name, count: 1 };
  }
  const zip = new JSZip();
  pageBlobs.forEach((p) => zip.file(p.name, p.blob));
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { blob: zipBlob, filename: `${baseName}_images.zip`, count: pageBlobs.length };
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
    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 90));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return { blob, filename: `${files[0].name.replace(/\.[^.]+$/, '')}_converted.pdf`, count: files.length };
}

export async function executeConversion(
  files: File[],
  source: SourceFormat,
  target: TargetFormat,
  onProgress?: (pct: number) => void
): Promise<ConvertResult> {
  if (files.length === 0) throw new Error('No files provided');
  const file = files[0];
  const baseName = file.name.replace(/\.[^.]+$/, '');

  // 1. Source: Images -> PDF
  if (source === 'images') {
    return convertImagesToPdf(files, onProgress);
  }

  const buf = await file.arrayBuffer();

  // 2. Source: PDF
  if (source === 'pdf') {
    if (target === 'jpg' || target === 'png') {
      return convertPdfToImages(buf, target, baseName, onProgress);
    }
    if (target === 'docx') {
      const text = await extractPdfToMarkdown(buf, baseName);
      const blob = await generateDocx(text, baseName);
      return { blob, filename: `${baseName}.docx`, count: 1 };
    }
    if (target === 'csv') {
      const csv = await extractPdfToCsv(buf);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      return { blob, filename: `${baseName}.csv`, count: 1 };
    }
    if (target === 'md') {
      const md = await extractPdfToMarkdown(buf, baseName);
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      return { blob, filename: `${baseName}.md`, count: 1 };
    }
    const txt = await extractPdfToText(buf);
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    return { blob, filename: `${baseName}.txt`, count: 1 };
  }

  // 3. Source: DOCX
  if (source === 'docx') {
    const text = await extractTextFromDocx(buf);
    if (target === 'pdf') {
      const blob = await convertTextToPdf(text, baseName);
      return { blob, filename: `${baseName}.pdf`, count: 1 };
    }
    const ext = target === 'md' ? 'md' : 'txt';
    const mime = target === 'md' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    return { blob, filename: `${baseName}.${ext}`, count: 1 };
  }

  // 4. Source: Text-based (MD, CSV, TXT)
  const rawText = await file.text();
  if (target === 'pdf') {
    const blob = await convertTextToPdf(rawText, baseName);
    return { blob, filename: `${baseName}.pdf`, count: 1 };
  }
  if (target === 'docx') {
    const blob = await generateDocx(rawText, baseName);
    return { blob, filename: `${baseName}.docx`, count: 1 };
  }
  const ext = target === 'md' ? 'md' : target === 'csv' ? 'csv' : 'txt';
  const mime = target === 'md' ? 'text/markdown' : target === 'csv' ? 'text/csv' : 'text/plain';
  const blob = new Blob([rawText], { type: `${mime};charset=utf-8` });
  return { blob, filename: `${baseName}.${ext}`, count: 1 };
}
