import { PDFDocument, degrees } from 'pdf-lib';
import type { PdfPageDetail } from '../../types/pdf.types';

/**
 * Creates a new PDF with pages rearranged according to the reordered pages array,
 * preserving any per-page rotations.
 */
export async function saveReorderedPdf(
  sourceBuffer: ArrayBuffer,
  reorderedPages: PdfPageDetail[],
  outputFilename: string = 'reordered-document.pdf'
): Promise<{ blob: Blob; filename: string }> {
  const safeBuffer = sourceBuffer.slice(0);
  const srcDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
  const newDoc = await PDFDocument.create();

  const originalIndices = reorderedPages.map((p) => p.originalPageIndex);
  const copiedPages = await newDoc.copyPages(srcDoc, originalIndices);

  copiedPages.forEach((page, i) => {
    const extraRot = reorderedPages[i].rotation;
    if (extraRot) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + extraRot) % 360));
    }
    newDoc.addPage(page);
  });

  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

  const finalName = outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`;

  return { blob, filename: finalName };
}
