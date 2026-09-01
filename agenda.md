# Project Agenda: Client-Side PDF Splitter & Merger

## Milestones & Tasks

- [x] **Milestone 1: Project Initialization & Setup**
  - [x] Git initialization, branch configuration
  - [x] `.gitignore` setup
  - [x] Tracking agenda (`agenda.md`) created
  - [ ] Vite + React 18 + TypeScript strict mode initialization
  - [ ] Dependencies installation (`pdf-lib`, `pdfjs-dist`, `jszip`, `file-saver`, `lucide-react`, `@hello-pangea/dnd`, Tailwind CSS)

- [ ] **Milestone 2: Design System & Styling**
  - [ ] Configure `variables.css` with CSS custom properties (flat modern aesthetic, solid colors, zero gradients)
  - [ ] Configure `globals.css` and `tailwind.config.js` with design tokens
  - [ ] Persistent layout dimensions (4rem header, 3.5rem footer)

- [ ] **Milestone 3: Core Architecture & Pure Services (Decoupled)**
  - [ ] `pdf.types.ts` type definitions
  - [ ] `pdfRenderer.ts` using `pdfjs-dist` with worker configuration
  - [ ] `pdfSplitter.ts` using `pdf-lib` and `jszip`
  - [ ] `pdfMerger.ts` using `pdf-lib`

- [ ] **Milestone 4: Custom React Hooks**
  - [ ] `usePdfSession.ts`
  - [ ] `usePdfSplit.ts`
  - [ ] `usePdfMerge.ts`

- [ ] **Milestone 5: Layout & Common Components**
  - [ ] Layout: `AppLayout`, `Header`, `Footer`
  - [ ] Common: `Button`, `Card`, `Dropzone`, `Modal`, `ProgressBar`, `Badge`

- [ ] **Milestone 6: Split PDF Feature & Components**
  - [ ] `SplitConfigPanel` (Modes: Extract Pages, Split by Range, Split Every N Pages, Single Pages)
  - [ ] `PagePreviewGrid` & `PageThumbnailCard` (Selection, rotation, preview modal)
  - [ ] Split processing & Zip/PDF download

- [ ] **Milestone 7: Join PDF Feature & Components**
  - [ ] `MergeFileList` & `MergeFileItem` (Drag & drop reordering, remove, page range selector)
  - [ ] Merge processing & download

- [ ] **Milestone 8: Routing & Application Pages**
  - [ ] `LandingPage`
  - [ ] `UtilitiesHubPage`
  - [ ] `SplitPdfPage`
  - [ ] `JoinPdfPage`
  - [ ] `AppRoutes` integration

- [ ] **Milestone 9: End-to-End Verification & Production Build**
  - [ ] TypeScript compilation check
  - [ ] Vite production build test
  - [ ] Manual & automated validation of PDF operations
