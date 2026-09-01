import JSZip from 'jszip';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export async function generateXlsx(rows: string[][]): Promise<Blob> {
  const zip = new JSZip();

  const rowsXml = rows
    .map((row, rIdx) => {
      const rNum = rIdx + 1;
      const cellsXml = row
        .map((val, cIdx) => {
          const colRef = colToLetter(cIdx);
          const cellRef = `${colRef}${rNum}`;
          const isNum = val !== '' && !isNaN(Number(val));
          if (isNum) {
            return `<c r="${cellRef}"><v>${val}</v></c>`;
          }
          return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`;
        })
        .join('');
      return `<row r="${rNum}">${cellsXml}</row>`;
    })
    .join('');

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;

  zip.file('[Content_Types].xml', contentTypes);
  zip.file('_rels/.rels', rels);
  zip.file('xl/_rels/workbook.xml.rels', wbRels);
  zip.file('xl/workbook.xml', workbook);
  zip.file('xl/worksheets/sheet1.xml', sheet);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function extractTableFromXlsx(buffer: ArrayBuffer): Promise<string[][]> {
  const zip = await JSZip.loadAsync(buffer);
  const sheetXml = await zip.file('xl/worksheets/sheet1.xml')?.async('text');
  if (!sheetXml) return [];

  // Optional shared strings
  const ssXml = await zip.file('xl/sharedStrings.xml')?.async('text');
  const sharedStrings: string[] = [];
  if (ssXml) {
    const p = new DOMParser().parseFromString(ssXml, 'application/xml');
    const items = p.getElementsByTagNameNS('*', 'si');
    for (let i = 0; i < items.length; i++) {
      sharedStrings.push(items[i].textContent || '');
    }
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(sheetXml, 'application/xml');
  const rowElements = xml.getElementsByTagNameNS('*', 'row');
  const rows: string[][] = [];

  for (let r = 0; r < rowElements.length; r++) {
    const cellElements = rowElements[r].getElementsByTagNameNS('*', 'c');
    const rowVals: string[] = [];
    for (let c = 0; c < cellElements.length; c++) {
      const cell = cellElements[c];
      const type = cell.getAttribute('t');
      let val = '';
      if (type === 's') {
        const idx = parseInt(cell.textContent || '0', 10);
        val = sharedStrings[idx] || '';
      } else {
        val = cell.textContent || '';
      }
      rowVals.push(val.trim());
    }
    if (rowVals.some((v) => v.length > 0)) rows.push(rowVals);
  }

  return rows;
}
