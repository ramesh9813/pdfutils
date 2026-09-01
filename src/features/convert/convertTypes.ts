export type SourceFormat = 'pdf' | 'docx' | 'xlsx' | 'md' | 'images' | 'txt';
export type TargetFormat = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'md' | 'jpg' | 'png' | 'txt';

export interface ConvertResult {
  blob: Blob;
  filename: string;
  count: number;
}

export const FORMAT_ACCEPT_MAP: Record<SourceFormat, string> = {
  pdf: '.pdf,application/pdf',
  docx: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: '.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
  md: '.md,text/markdown,text/plain',
  images: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  txt: '.txt,text/plain',
};

export const TARGET_OPTIONS_MAP: Record<SourceFormat, TargetFormat[]> = {
  pdf: ['docx', 'xlsx', 'csv', 'md', 'jpg', 'png', 'txt'],
  docx: ['pdf', 'md', 'txt'],
  xlsx: ['pdf', 'csv', 'md', 'txt'],
  md: ['pdf', 'docx', 'txt'],
  images: ['pdf'],
  txt: ['pdf', 'docx', 'xlsx', 'md'],
};

export const FORMAT_LABELS: Record<string, string> = {
  pdf: 'PDF Document (.pdf)',
  docx: 'Word Document (.docx)',
  xlsx: 'Excel Workbook (.xlsx)',
  csv: 'CSV Table (.csv)',
  md: 'Markdown (.md)',
  images: 'Images (.jpg, .png)',
  jpg: 'JPG Images (.jpg)',
  png: 'PNG Images (.png)',
  txt: 'Plain Text (.txt)',
};
