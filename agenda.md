# Project Agenda: Client-Side PDF Splitter & Merger

## Milestones & Tasks

- [x] **Milestone 1: Project Initialization & Setup**
  - [x] Git initialization, branch configuration
  - [x] `.gitignore` setup
  - [x] Tracking agenda (`agenda.md`) created
  - [x] Vite + React 18 + TypeScript strict mode initialization
  - [x] Dependencies installation (`pdf-lib`, `pdfjs-dist`, `jszip`, `file-saver`, `lucide-react`, `@hello-pangea/dnd`, Tailwind CSS)

- [x] **Milestone 2: Design System & Styling**
  - [x] Configure `variables.css` with CSS custom properties (flat modern aesthetic, solid colors, zero gradients)
  - [x] Configure `globals.css` and `tailwind.config.js` with design tokens
  - [x] Persistent layout dimensions (4rem header, 3.5rem footer)

- [x] **Milestone 3: Core Architecture & Pure Services (Decoupled)**
  - [x] `pdf.types.ts` type definitions
  - [x] `pdfRenderer.ts` using `pdfjs-dist` with worker configuration
  - [x] `pdfSplitter.ts` using `pdf-lib` and `jszip`
  - [x] `pdfMerger.ts` using `pdf-lib`

- [x] **Milestone 4: Custom React Hooks**
  - [x] `usePdfSession.ts` (Progressive thumbnails, multi-page parsing, rotation)
  - [x] `usePdfSplit.ts` (Split mode selection, validation, zip packaging, download)
  - [x] `usePdfMerge.ts` (Queue management, drag & drop, rotation, per-file range, download)

- [x] **Milestone 5: Layout & Common Components**
  - [x] Layout: `AppLayout`, `Header`, `Footer`
  - [x] Common: `Button`, `Card`, `Dropzone`, `Modal`, `ProgressBar`, `Badge`

- [x] **Milestone 6: Split PDF Feature & Components**
  - [x] `SplitConfigPanel` (Modes: Extract Pages, Split by Range, Split Every N Pages, Single Pages)
  - [x] `PagePreviewGrid` & `PageThumbnailCard` (Selection, rotation, preview modal, multi-size views)
  - [x] Split processing & Zip/PDF download

- [x] **Milestone 7: Join PDF Feature & Components**
  - [x] `MergeFileList` & `MergeFileItem` (Drag & drop reordering, remove, page range selector, rotation)
  - [x] Merge processing & download

- [x] **Milestone 8: Routing & Application Pages**
  - [x] `LandingPage` (Hero, feature cards, privacy architecture)
  - [x] `UtilitiesHubPage` (Tool cards, runtime specs, feature checklist)
  - [x] `SplitPdfPage` (Full split workspace with preview and live status)
  - [x] `JoinPdfPage` (Full merge workspace with queue management)
  - [x] `AppRoutes` integration

- [x] **Milestone 9: End-to-End Verification & Production Build**
  - [x] TypeScript strict compilation check
  - [x] Vite production build test
  - [x] Automated and manual verification of core PDF split and merge workflows
