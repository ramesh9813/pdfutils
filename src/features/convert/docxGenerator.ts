import JSZip from 'jszip';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function generateDocx(text: string, title = 'Document'): Promise<Blob> {
  const zip = new JSZip();
  const lines = text.split('\n');

  const paragraphsXml = lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<w:p/>';
      const isHeading = trimmed.startsWith('#');
      const clean = isHeading ? trimmed.replace(/^#+\s*/, '') : trimmed;
      const sz = isHeading ? '30' : '22';
      const bold = isHeading ? '<w:b/>' : '';
      return `<w:p><w:pPr><w:spacing w:after="120"/><w:rPr>${bold}<w:sz w:val="${sz}"/></w:rPr></w:pPr><w:r><w:rPr>${bold}<w:sz w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${escapeXml(clean)}</w:t></w:r></w:p>`;
    })
    .join('');

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:spacing w:after="240"/><w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r></w:p>
    ${paragraphsXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  zip.file('[Content_Types].xml', contentTypes);
  zip.file('_rels/.rels', rels);
  zip.file('word/document.xml', documentXml);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = await zip.file('word/document.xml')?.async('text');
  if (!docXml) return '';

  const parser = new DOMParser();
  const xml = parser.parseFromString(docXml, 'application/xml');
  const paragraphs = xml.getElementsByTagNameNS('*', 'p');
  const result: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const textNodes = paragraphs[i].getElementsByTagNameNS('*', 't');
    let pText = '';
    for (let j = 0; j < textNodes.length; j++) {
      pText += textNodes[j].textContent || '';
    }
    result.push(pText);
  }

  return result.join('\n');
}
