# Loan Workflow System - Architecture Document

## System Overview

A dynamic workflow management system for loan applications that:

- Parses JSON workflow definitions into interactive visual graphs
- Renders dynamic forms based on state configurations
- Tracks multiple loan applications through workflow stages
- Provides dashboard for queue management

## File Structure & Responsibilities

### Core Types

**`types/workflow.types.ts`**

```typescript
interface FieldAction {
  Operation: string; // save, validate, upload, calculate, etc.
}

interface Field {
  ID: string;
  Name: string;
  Type: string; // text, number, select, textarea, file
  DataSource: string; // Template syntax for data binding
  FieldActions: FieldAction[];
}

interface StateAction {
  NextState: string;
  Operation: string; // Business logic to execute
}

interface State {
  Form?: { Fields: Field[] };
  Actions?: Record<string, StateAction>; // State transitions
}

interface Workflow {
  States: Record<string, State>;
}
```

### Parser

**`utils/graphParser.ts`**

- Converts workflow JSON → React Flow nodes/edges
- Creates nodes from States
- Creates edges from State.Actions
- Auto-layouts using grid positioning
- Handles implicit state connections

### Components

**`App.tsx`** - Application Controller

- Manages view modes: dashboard | graph | form
- Handles workflow JSON updates
- Controls navigation between views
- Maintains current state selection

**`Dashboard.tsx`** - Queue Management

```
Features:
- Table view of loan applications
- Status indicators (Disbursement, Verification, etc.)
- Filtering by status/product/assignee
- Quick actions per application
```

# Loan Workflow System — Unified State & Architecture

This document combines the original architecture notes, README guidance, refactor summary, and findings from a recent code review into a single authoritative reference for the project.

## Purpose

Provide a single, developer-facing snapshot of:
- System architecture and responsibilities
- Key types and data shapes
- Component responsibilities and notable implementation details
- Recent refactors and quality improvements
- Known issues, risks, and recommended next steps

This file should help maintainers onboard quickly and guide follow-up work.

## System Overview

The app converts JSON workflow definitions into an interactive visual graph and runtime UI for forms. Main capabilities:

- Parse workflow JSON → graph nodes/edges
- Render interactive React Flow canvas
- Show state details and dynamic forms driven by JSON
- Export graph and workflow definitions
- Dashboard for managing loan applications and navigating to workflows

## Core Types (summary)

Key types live in `src/types/workflow.types.ts` and represent the schema the app expects. Representative shapes:

```

FieldAction { Operation: string }

Field {
ID: string
Name: string
Type: string // text | number | select | textarea | file | date | checkbox
DataSource?: string
FieldActions?: FieldAction[] // preferred
Actions?: string[] // legacy
}

StateAction { NextState: string; Operation?: string }

State { Form?: { Fields: Field[] }; Actions?: Record<string, StateAction> }

```

Notes:
- The codebase currently accepts both `Field.FieldActions` (preferred) and legacy `Field.Actions` (string[]). Consider migrating to a single canonical format (see recommendations).

## Files & Responsibilities

- `src/utils/graphParser.ts` — Converts workflow JSON into React Flow nodes and edges. Uses a grid-like auto-layout and annotates edges with operation metadata.
- `src/utils/graphExport.ts` — Centralized graph export helper for JSON/PNG export.
- `src/components/WorkflowGraph.tsx` — Canvas rendering using React Flow. Integrates the toolbar, node types, and `DetailPanel`.
- `src/components/DetailPanel.tsx` — Right-hand details view for selected node/edge. Lists fields and actions; provides "Form View" shortcut.
- `src/components/StateNode.tsx` — Visual node used by React Flow; shows state label and field count.
- `src/components/FormViewer.tsx` — Renders a state form from field definitions (read/edit modes).
- `src/components/form/FieldInput.tsx` — Reusable field renderer for common input types.
- `src/components/table/ApplicationRow.tsx` — Row rendering for application table.
- `src/components/graph/GraphToolbar.tsx` — Compact toolbar for export/controls in the graph view.
- `src/components/TopBar.tsx` — Shared top header across major views.

## Data Flow

1. Developer or user provides a workflow JSON in the JSON editor.
2. `graphParser` builds nodes and edges from `Workflow.States` and per-state `Actions`.
3. `WorkflowGraph` renders nodes & edges in React Flow.
4. User interactions: select node/edge → `DetailPanel` → open `FormViewer` → trigger actions.

## Recent Refactor Highlights

- Split large components into smaller, focused components (TopBar, GraphToolbar, ApplicationRow, FieldInput).
- Centralized export logic in `src/utils/graphExport.ts` to avoid duplicate code and to keep components small.
- Reworked `DetailPanel.tsx` to use explicit types (`NodeData` / `EdgeData`) and removed unsafe `any` casts.
- Consolidated color mapping into `src/utils/colors.ts` (getStageColor) used across UI.
- Removed unused imports and replaced nested ternaries with clearer conditionals.

These changes improve maintainability, readability, and testability while preserving runtime behavior.

## Known Issues & Code Review Findings

The following items were flagged during a code review and should be considered for follow-up work:

1. Type safety
  - Inconsistent handling of field actions (`Field.Actions` vs `Field.FieldActions`). Recommend migrating to a single shape or using a discriminated union.
  - Add runtime validation of incoming workflow JSON (JSON Schema or zod) to avoid runtime errors.

2. Duplication & consistency
  - Action extraction logic is duplicated in places (e.g., `DetailPanel` vs `StateNode`). Extract to a shared helper/hook.
  - Field rendering inconsistencies: `FormViewer`/`FieldInput` should fully support documented field types (date, checkbox, etc.).

3. Performance
  - Grid auto-layout in `graphParser` is simplistic and may overlap nodes for large workflows. Consider integrating a layout engine (elkjs is a dependency and can be used for better layouts).
  - Avoid heavy data transformation during render of `DetailPanel` by precomputing derived data.

4. State management
  - Current app state is mostly local. For complex flows, consider a lightweight global store (Zustand) or React Context with selectors.

5. Accessibility & UX
  - Improve ARIA attributes and keyboard navigation in interactive components.
  - Enhance error reporting in the JSON editor to show helpful validation messages.

6. Security
  - Sanitize any HTML or user-provided content before rendering. Avoid `dangerouslySetInnerHTML` or sanitize inputs if necessary.

## Application Details Feature Bugs

After reviewing the application details feature, several bugs and issues were identified:

### Type Safety Issues
1. **Duplicate Interface Definitions**: Interfaces like `AppDocument`, `AuditEntry`, and `WorkflowStage` are defined in multiple files instead of being in a shared types file.
2. **Inconsistent Type Definitions**: The `WorkflowStage` interface is duplicated in both `ApplicationDetails.tsx` and `WorkflowProgress.tsx`.

### Data Handling Bugs
1. **Hardcoded Data**: All components in the application details feature use hardcoded data instead of properly handling data passed from props.
2. **Missing Data Properties**: The `LoanApplication` interface doesn't include all the properties needed by the components.

### Logic Bugs
1. **Incorrect Email Generation**: The email generation in `ContactInfo.tsx` is overly simplistic and will break with many real names.
2. **Hardcoded Interest Rate**: The interest rate in `FinancialDetails.tsx` is hardcoded instead of being configurable.
3. **Incomplete Comment Functionality**: Comments in `AuditTrail.tsx` are never actually added to the audit trail - they just clear the input.

### UI/UX Issues
1. **Inconsistent Styling**: Extensive use of inline styles makes it difficult to maintain consistent styling.
2. **Missing Error Handling**: No error handling for operations like downloading documents or adding comments.
3. **Accessibility Issues**: Missing proper ARIA attributes, potential color contrast issues, and no keyboard navigation support.

### Security Issues
1. **Potential XSS Vulnerabilities**: User-generated content in the audit trail is displayed directly without sanitization.

### Missing Features
1. **Incomplete Document Functionality**: Document upload and download buttons don't actually perform any actions.
2. **Missing API Integration**: All data is hardcoded with no actual backend integration.

For a detailed list of bugs and recommendations, see [APPLICATION_DETAILS_BUGS.md](APPLICATION_DETAILS_BUGS.md).

## Recommendations & Next Steps

Short-term (low risk):

- Add a small runtime validator for workflow JSON (zod or ajv) and surface errors in the JSON editor.
- Extract field action parsing into `src/utils/fieldActions.ts` and reuse from `DetailPanel` and `StateNode`.
- Complete `FieldInput` coverage for all documented field types and remove hardcoded options.

Medium-term:

- Replace grid layout with an ELK-powered layout (uses `elkjs` already in dependencies). This will improve node placement for complex workflows.
- Add unit tests for `graphParser` and `graphExport`.
- Introduce a lightweight global store for shared app state (Zustand or Context + selectors).

Long-term:

- Add E2E tests (Playwright) for the main user flows: dashboard → graph → form → action.
- Implement CI with typecheck, eslint, and build on PRs.

## Developer Quick Start

1. Install dependencies

```powershell
npm ci
```

2. Run dev server

```powershell
npm run dev
```

3. Typecheck & lint

```powershell
npm run typecheck
npm run lint
```

4. Build

```powershell
npm run build
```

## Project Status & Verification

- Refactor: Core modularization and typing improvements are completed (key files: `DetailPanel`, `FormViewer`, `WorkflowGraph`, `graphExport`, `FieldInput`).
- Lint/type checks: File-level fixes applied; full project-level typecheck/lint/build should be run in an environment with Node/npm installed to confirm.

## Files to Inspect First (for maintainers)

- `src/types/workflow.types.ts` — canonical shapes and suggested type improvements.
- `src/utils/graphParser.ts` — conversion rules and layout logic.
- `src/components/DetailPanel.tsx` — recently refactored; ensures safe rendering of fields/actions.
- `src/components/form/FieldInput.tsx` — central input renderer; extend to cover missing field types.

## Appendix: Example Workflow JSON

```json
{
  "Workflow": {
    "States": {
      "Application": {
        "Form": {
          "Fields": [
            {
              "ID": "loan_amount",
              "Name": "Requested Amount",
              "Type": "number",
              "DataSource": "{{ data.loan.amount }}",
              "Actions": ["validate", "calculate"]
            }
          ]
        }
      },
      "Review": {
        "Form": {
          "Fields": [
            {
              "ID": "decision",
              "Name": "Approval Decision",
              "Type": "select",
              "DataSource": "{{ data.review.decision }}",
              "Actions": ["validate"]
            }
          ]
        }
      },
      "Completed": {}
    }
  }
}
```

---

Maintainers: update this document as the codebase evolves. It is intended to be the single source of truth for architecture and short-term roadmap.
