export type SourceFormat = 'pdf' | 'docx' | 'csv' | 'md' | 'images' | 'txt';
export type TargetFormat = 'pdf' | 'jpg' | 'png' | 'docx' | 'csv' | 'md' | 'txt';

export interface ConvertResult {
  blob: Blob;
  filename: string;
  count: number;
}

export const FORMAT_ACCEPT_MAP: Record<SourceFormat, string> = {
  pdf: '.pdf,application/pdf',
  docx: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: '.csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  md: '.md,text/markdown,text/plain',
  images: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  txt: '.txt,text/plain',
};

export const TARGET_OPTIONS_MAP: Record<SourceFormat, TargetFormat[]> = {
  pdf: ['jpg', 'png', 'docx', 'csv', 'md', 'txt'],
  docx: ['pdf', 'md', 'txt'],
  csv: ['pdf', 'md', 'txt'],
  md: ['pdf', 'docx', 'txt'],
  images: ['pdf'],
  txt: ['pdf', 'docx', 'md'],
};
