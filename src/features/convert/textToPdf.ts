import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function convertTextToPdf(text: string, title = 'Document'): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title
  page.drawText(title, {
    x: margin,
    y: y - 16,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  y -= 38;

  const lines = text.split('\n');

  for (const rawLine of lines) {
    const isHeader = rawLine.trim().startsWith('#');
    const isBullet = rawLine.trim().startsWith('- ') || rawLine.trim().startsWith('* ');
    const lineText = isHeader
      ? rawLine.replace(/^#+\s*/, '')
      : isBullet
      ? `•  ${rawLine.replace(/^[-*]\s*/, '')}`
      : rawLine;

    const font = isHeader ? fontBold : fontRegular;
    const size = isHeader ? 13 : 10;
    const lineHeight = isHeader ? 20 : 14;

    const words = lineText.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);

      if (width > contentWidth && currentLine) {
        if (y < margin + 20) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(currentLine, { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y < margin + 20) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(currentLine, { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }

    if (!rawLine.trim()) y -= 6;
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function convertTableToPdf(rows: string[][], title = 'Spreadsheet'): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title
  page.drawText(title, { x: margin, y: y - 14, size: 16, font: fontBold, color: rgb(0.1, 0.15, 0.25) });
  y -= 32;

  if (rows.length === 0) {
    const bytes = await pdfDoc.save();
    return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  const numCols = Math.min(Math.max(...rows.map((r) => r.length)), 8) || 1;
  const colWidth = contentWidth / numCols;
  const rowHeight = 18;

  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const row = rows[rIdx];
    const isHeader = rIdx === 0;

    if (y < margin + 20) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    // Shaded header background
    if (isHeader) {
      page.drawRectangle({
        x: margin,
        y: y - 4,
        width: contentWidth,
        height: rowHeight,
        color: rgb(0.92, 0.95, 0.98),
      });
    }

    for (let cIdx = 0; cIdx < numCols; cIdx++) {
      const text = row[cIdx] || '';
      const font = isHeader ? fontBold : fontRegular;
      const size = isHeader ? 9 : 8.5;
      const cellX = margin + cIdx * colWidth + 4;

      // Truncate cell text if exceeding column width
      let cellText = text;
      while (cellText.length > 0 && font.widthOfTextAtSize(cellText, size) > colWidth - 8) {
        cellText = cellText.slice(0, -1);
      }

      page.drawText(cellText, {
        x: cellX,
        y: y,
        size,
        font,
        color: isHeader ? rgb(0.05, 0.15, 0.3) : rgb(0.15, 0.15, 0.15),
      });
    }

    y -= rowHeight;
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
