import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from './Button';

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  multiple = false,
  title = 'Drop PDF here',
  subtitle = '100% in-browser processing.',
  accept = 'application/pdf',
  disabled = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      // Reset input value so selecting same file triggers change
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center rounded border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
        isDragOver
          ? 'border-primary bg-sky-50/50'
          : 'border-border bg-bg-surface hover:border-primary/60 hover:bg-bg-subtle/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
      />

      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded border border-border bg-bg-subtle text-primary group-hover:border-primary/40 group-hover:scale-105 transition-transform">
        <UploadCloud className="h-6 w-6" />
      </div>

      <h3 className="text-sm font-semibold text-text-main mb-0.5">{title}</h3>
      <p className="max-w-md text-xs text-text-muted mb-3">{subtitle}</p>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        leftIcon={<FileText className="h-3 w-3" />}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        disabled={disabled}
      >
        {multiple ? 'Browse PDFs' : 'Browse PDF'}
      </Button>
    </div>
  );
};
