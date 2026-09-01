import { loadPdfDocument } from '../../services/pdfRenderer';

export async function extractPdfToText(fileBuffer: ArrayBuffer): Promise<string> {
  const doc = await loadPdfDocument(fileBuffer);
  let result = '';

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await (page as any).getTextContent();
    const pageText = content.items.map((it: any) => it.str || '').join(' ');
    result += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  doc.destroy();
  return result;
}

export async function extractPdfToMarkdown(fileBuffer: ArrayBuffer, baseName: string): Promise<string> {
  const doc = await loadPdfDocument(fileBuffer);
  let md = `# ${baseName}\n\n`;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await (page as any).getTextContent();
    md += `## Page ${i}\n\n`;

    let prevY = 0;
    let line = '';

    for (const item of content.items) {
      const it = item as any;
      const y = it.transform ? Math.round(it.transform[5]) : 0;

      if (prevY !== 0 && Math.abs(prevY - y) > 5) {
        if (line.trim()) md += `${line.trim()}\n\n`;
        line = '';
      }
      line += (it.str || '') + ' ';
      prevY = y;
    }

    if (line.trim()) md += `${line.trim()}\n\n`;
  }

  doc.destroy();
  return md;
}

export async function extractPdfToCsv(fileBuffer: ArrayBuffer): Promise<string> {
  const doc = await loadPdfDocument(fileBuffer);
  const rows: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await (page as any).getTextContent();
    let currentLine: string[] = [];
    let prevY = 0;

    for (const item of content.items) {
      const it = item as any;
      const y = it.transform ? Math.round(it.transform[5]) : 0;

      if (prevY !== 0 && Math.abs(prevY - y) > 4) {
        if (currentLine.length > 0) {
          rows.push(currentLine.map((c) => `"${c.replace(/"/g, '""')}"`).join(','));
        }
        currentLine = [];
      }

      if (it.str && it.str.trim()) {
        currentLine.push(it.str.trim());
      }
      prevY = y;
    }

    if (currentLine.length > 0) {
      rows.push(currentLine.map((c) => `"${c.replace(/"/g, '""')}"`).join(','));
    }
  }

  doc.destroy();
  return rows.join('\n');
}
