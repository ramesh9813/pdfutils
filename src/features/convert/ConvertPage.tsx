import React, { useState } from 'react';
import saveAs from 'file-saver';
import { useSharedPdf } from '../../context/PdfContext';
import { ConvertFormatSelector } from './ConvertFormatSelector';
import { ConvertFileBanner } from './ConvertFileBanner';
import type { SourceFormat, TargetFormat, ConvertResult } from './convertTypes';
import { FORMAT_ACCEPT_MAP } from './convertTypes';
import { executeConversion } from './convertEngine';
import { Dropzone } from '../../components/common/Dropzone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import type { ProgressState } from '../../types/pdf.types';
import { RefreshCw, Download, RotateCcw, CheckCircle2 } from 'lucide-react';

export const ConvertPage: React.FC = () => {
  const { sharedFile, clearSharedFile } = useSharedPdf();
  const [fromFormat, setFromFormat] = useState<SourceFormat>('pdf');
  const [toFormat, setToFormat] = useState<TargetFormat>('jpg');
  const [files, setFiles] = useState<File[]>(sharedFile ? [sharedFile] : []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    current: 0,
    total: 100,
    message: '',
  });

  const validateFiles = (selected: File[], source: SourceFormat): File[] => {
    if (source === 'pdf') {
      return selected.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    }
    if (source === 'docx') {
      return selected.filter((f) => f.name.toLowerCase().endsWith('.docx'));
    }
    if (source === 'xlsx') {
      return selected.filter((f) => /\.(csv|xlsx)$/i.test(f.name));
    }
    if (source === 'md') {
      return selected.filter((f) => /\.(md|markdown|txt)$/i.test(f.name));
    }
    if (source === 'images') {
      return selected.filter((f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name));
    }
    return selected;
  };

  const handleFilesSelected = (selected: File[]) => {
    setErrorMsg(null);
    setResult(null);

    const valid = validateFiles(selected, fromFormat);
    if (valid.length === 0) {
      setErrorMsg(`Only ${fromFormat.toUpperCase()} files allowed for this conversion.`);
      return;
    }
    setFiles(fromFormat === 'images' ? valid : [valid[0]]);
  };

  const handleExecute = async () => {
    if (files.length === 0) return;
    setErrorMsg(null);
    setProgress({ status: 'processing', current: 15, total: 100, message: 'Converting...' });

    try {
      const out = await executeConversion(files, fromFormat, toFormat, (p) =>
        setProgress((prev) => ({ ...prev, current: p }))
      );
      setResult(out);
      setProgress({ status: 'completed', current: 100, total: 100, message: 'Done!' });
      saveAs(out.blob, out.filename);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setErrorMsg(msg);
      setProgress({ status: 'error', current: 0, total: 100, message: msg, error: msg });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setErrorMsg(null);
    clearSharedFile();
    setProgress({ status: 'idle', current: 0, total: 100, message: '' });
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full py-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Universal File Converter
          </h1>
          <p className="text-xs text-text-sub mt-0.5">PDF ↔ Word, Excel, Markdown, and Images.</p>
        </div>
        {files.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            New File
          </Button>
        )}
      </div>

      <ConvertFormatSelector
        fromFormat={fromFormat}
        toFormat={toFormat}
        disabled={progress.status === 'processing'}
        onFromChange={(f) => {
          setFromFormat(f);
          setFiles([]);
          setResult(null);
        }}
        onToChange={setToFormat}
      />

      {errorMsg && (
        <div className="p-3 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded-lg">
          {errorMsg}
        </div>
      )}

      {files.length === 0 ? (
        <Dropzone
          multiple={fromFormat === 'images'}
          accept={FORMAT_ACCEPT_MAP[fromFormat]}
          title={`Drop ${fromFormat.toUpperCase()} here`}
          subtitle={`Strictly ${fromFormat.toUpperCase()} files accepted.`}
          onFilesSelected={handleFilesSelected}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <ConvertFileBanner files={files} toFormat={toFormat} onReset={handleReset} />
          {progress.status !== 'idle' && <ProgressBar progress={progress} />}

          {result && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5 text-text-main">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold">Converted: {result.filename}</span>
              </div>
              <Button type="button" variant="primary" size="sm" onClick={() => saveAs(result.blob, result.filename)} leftIcon={<Download className="h-3.5 w-3.5" />}>
                Download Again
              </Button>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleExecute}
            disabled={progress.status === 'processing'}
            className="w-full py-2.5 text-xs font-semibold cursor-pointer"
          >
            {progress.status === 'processing'
              ? `Converting... (${progress.current}%)`
              : `Convert to ${toFormat.toUpperCase()} & Download`}
          </Button>
        </div>
      )}
    </div>
  );
};
