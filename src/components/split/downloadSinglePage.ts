import { PDFDocument, degrees } from 'pdf-lib';
import saveAs from 'file-saver';

/**
 * Extracts a single page from a PDF buffer, applies its current rotation,
 * and triggers an instant client-side download as a single-page PDF.
 */
export async function downloadRotatedPage(
  sourceBuffer: ArrayBuffer,
  pageNumber: number, // 1-indexed
  rotation: number = 0,
  baseDocName: string = 'document'
): Promise<void> {
  const safeBuffer = sourceBuffer.slice(0);
  const srcDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
  const newDoc = await PDFDocument.create();

  const [page] = await newDoc.copyPages(srcDoc, [pageNumber - 1]);
  if (rotation) {
    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees((currentAngle + rotation) % 360));
  }
  newDoc.addPage(page);

  const bytes = await newDoc.save();
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
  const cleanBase = baseDocName.replace(/\.pdf$/i, '');
  const filename = `${cleanBase}_page_${pageNumber}_rotated${rotation}deg.pdf`;

  saveAs(blob, filename);
}
