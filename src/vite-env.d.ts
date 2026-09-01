/// <reference types="vite/client" />

declare module 'pdfjs-dist' {
  export interface PDFPageViewport {
    width: number;
    height: number;
    rotation: number;
  }

  export interface PDFPageProxy {
    rotate: number;
    getViewport(params: { scale: number; rotation?: number }): PDFPageViewport;
    render(params: {
      canvasContext: CanvasRenderingContext2D;
      viewport: PDFPageViewport;
    }): { promise: Promise<void> };
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): void;
  }

  export interface PDFLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export function getDocument(src: any): PDFLoadingTask;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
}

declare module 'pdfjs-dist/build/pdf.worker.min.js?url' {
  const url: string;
  export default url;
}
