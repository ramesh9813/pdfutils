# PDFUtils

Fast, private, client-side PDF manipulation toolkit built with React, TypeScript, Vite, Tailwind CSS, and `pdf-lib`.

## Features
- **100% Client-Side**: Files are processed in browser memory using Web Workers. Zero server uploads.
- **Split PDF**: Python-based slice indexing (`1:5, 6:9`), visual blue cut points, hold-to-reorder, and selective section download.
- **Merge PDF**: Combine multiple PDFs at the beginning, end, or inside / middle of another PDF after page X.
- **Reduce PDF Size**: Dual sliders for visual quality percentage and target MB limit with real-time estimation.
- **Reorder Pages**: Visual thumbnail inspection, 90° page rotation, and hold-to-reorder.

## Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```
Publishes to `dist/`.
