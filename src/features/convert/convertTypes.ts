export type FromFormat = 'pdf' | 'images';
export type ToFormat = 'jpg' | 'png' | 'webp' | 'txt' | 'pdf';

export interface ConvertJob {
  from: FromFormat;
  to: ToFormat;
  files: File[];
}

export interface ConvertResult {
  blob: Blob;
  filename: string;
  count: number;
}
