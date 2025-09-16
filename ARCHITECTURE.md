# Project Architecture Guide

This document describes the current code structure, path aliases, and conventions for adding new features and extensions.

## Directory structure

Root

- `src/`
  - `app/`
    - `App.tsx` – Main application orchestrator
    - `App.css` – App-level styles
  - `assets/` – Static assets (images, svgs)
  - `components/` (removed)
  - `features/` – Feature-based code
    - `application-details/`
      - `components/`
        - `ApplicationDetails.tsx`
        - `ApplicationHeader.tsx`
        - `WorkflowProgress.tsx`
        - `ContactInfo.tsx`
        - `FinancialDetails.tsx`
        - `RiskSnapshot.tsx`
        - `DocumentsSection.tsx`
        - `AuditTrail.tsx`
    - `dashboard/`
      - `components/`
        - `Dashboard.tsx`
        - `DashboardHeader.tsx`
        - `ApplicationTable.tsx`
        - `ApplicationRow.tsx`
        - `ResultsCount.tsx`
      - `types/`
        - `dashboard.types.ts`
    - `form/`
      - `components/`
        - `FormViewer.tsx`
        - `FieldInput.tsx`
    - `workflow/`
      - `components/`
        - `WorkflowGraph.tsx`
        - `GraphToolbar.tsx`
        - `DetailPanel.tsx`
        - `StateNode.tsx`
        - `JsonEditor.tsx`
      - `types/`
        - `workflow.types.ts`
      - `utils/`
        - `graphParser.ts`
        - `graphExport.ts`
  - `pages/`
    - `NotFoundPage.tsx`
  - `shared/`
    - `components/`
      - `layout/`
        - `TopBar.tsx`
    - `utils/`
      - `colors.ts`
      - `download.ts`
  - `types/` (removed)
  - `utils/` (removed)
  - `index.css` – global styles
  - `main.tsx` – React entrypoint (wraps App with ReactFlowProvider)

Non-src

- `public/` – Static served files (index.html, vite.svg)
- `data/` – Sample JSON and mock data
- `vite.config.ts` – Vite configuration, including path aliases
- `tsconfig.app.json` – TypeScript compiler options and path aliases

## Path aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

- `@/…` → `src/…`
- `@features/…` → `src/features/…`
- `@shared/…` → `src/shared/…`
- `@pages/…` → `src/pages/…`

Example imports:

- `import App from '@/app/App'`
- `import { WorkflowGraph } from '@features/workflow/components/WorkflowGraph'`
- `import { getStageColor } from '@shared/utils/colors'`

## Conventions

- Feature-first organization: each feature contains its own components, types, and utils.
- Keep shared, generic building blocks under `src/shared`.
- Prefer colocated types (`features/<feature>/types`) over global types.
- Keep pages minimal; put logic in feature components.
- Use semantic, stable keys in lists (avoid array index keys).
- Keep components small and focused; extract utilities to `utils/` within the feature or to `src/shared/utils` when cross-cutting.
- Use the configured path aliases for imports.

### Barrel exports (recommended)

To simplify imports, add `index.ts` files that re-export public modules:

- `features/<feature>/components/index.ts`
- `features/<feature>/types/index.ts`
- `shared/components/index.ts`, etc.

Example barrel for `features/workflow/components/index.ts`:

```ts
export { default as WorkflowGraph } from "./WorkflowGraph";
export { default as GraphToolbar } from "./GraphToolbar";
export { default as DetailPanel } from "./DetailPanel";
export { default as StateNode } from "./StateNode";
export { default as JsonEditor } from "./JsonEditor";
```

Then import via:

```ts
import { WorkflowGraph } from "@features/workflow/components";
```

## Adding a new feature

1. Create the feature folders

   - `src/features/<feature-name>/components`
   - `src/features/<feature-name>/types` (optional)
   - `src/features/<feature-name>/utils` (optional)

2. Build your components

   - Place UI in `components/`; keep files small and focused.
   - Prefer local types under `types/` and local helpers under `utils/`.

3. Expose via barrels (optional but recommended)

   - Add `index.ts` in `components` and `types` to re-export public parts.

4. Import using aliases

   - `import { Thing } from '@features/<feature-name>/components'`

5. Write minimal docs (optional)
   - Consider adding a short `README.md` inside your feature folder describing its purpose and public API.

## Legacy folders

- On Sep 16, 2025, legacy folders `src/components`, `src/utils`, and `src/types` were removed to avoid confusion.
- All active code now lives under `src/features` and `src/shared`.

## Notes

- React Flow provider is set up in `src/main.tsx`. Components requiring React Flow context should render under `App`.
- Export helpers:
  - Workflow graph export lives at `@features/workflow/utils/graphExport` and uses `@shared/utils/download`.
- Colors: `getStageColor` in `@shared/utils/colors` centralizes stage color mapping.
- ESLint: config file renamed to `eslint.config.mjs` for ESM; `eslint.config.js` was removed.
