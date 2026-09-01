import { PDFDocument, degrees } from 'pdf-lib';
import type { MergeItem, MergeOptions, MergeOutput } from '../../types/pdf.types';
import { buildMergeAssembly } from './joinAssembly';

export async function mergePdfs(
  items: MergeItem[],
  options: MergeOptions,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<MergeOutput> {
  if (items.length < 2) {
    throw new Error('At least two PDF documents are required to perform a merge.');
  }

  onProgress?.(0, 100, 'Initializing merge engine...');
  const mergedPdf = await PDFDocument.create();
  mergedPdf.setTitle(options.outputFilename || 'merged-document.pdf');
  mergedPdf.setProducer('PDFUtils Client-Side Engine');

  const loadedDocs = new Map<string, PDFDocument>();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    onProgress?.(Math.round((i / items.length) * 30), 100, `Loading "${item.name}"...`);
    const safeBuffer = item.arrayBuffer.slice(0);
    const doc = await PDFDocument.load(safeBuffer, { ignoreEncryption: false });
    loadedDocs.set(item.id, doc);
  }

  const assemblyPages = buildMergeAssembly(items);
  if (assemblyPages.length === 0) {
    throw new Error('No pages were selected for merging across the provided files.');
  }

  const totalPages = assemblyPages.length;

  for (let i = 0; i < totalPages; i++) {
    const pageItem = assemblyPages[i];
    const srcDoc = loadedDocs.get(pageItem.fileId);
    if (!srcDoc) continue;

    const progressPercent = Math.round(30 + (i / totalPages) * 55);
    onProgress?.(progressPercent, 100, `Assembling page ${i + 1} of ${totalPages} (${pageItem.fileName})...`);

    const [copiedPage] = await mergedPdf.copyPages(srcDoc, [pageItem.pageIndex]);
    if (pageItem.rotationOffset) {
      const currentRot = copiedPage.getRotation().angle;
      const newRot = (currentRot + pageItem.rotationOffset) % 360;
      copiedPage.setRotation(degrees(newRot));
    }
    mergedPdf.addPage(copiedPage);
  }

  onProgress?.(90, 100, 'Generating final merged PDF bytes...');
  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

  const finalName = options.outputFilename.endsWith('.pdf')
    ? options.outputFilename
    : `${options.outputFilename}.pdf`;

  onProgress?.(100, 100, 'Merge complete!');

  return {
    blob,
    filename: finalName,
    totalPages,
    totalFiles: items.length,
  };
}
