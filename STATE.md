# Project State Report

_Last updated: 2025-09-15_

This document captures the CURRENT operational and architectural state of the `loan-workflow-ui` repository, including what works, how the system is structured, known gaps, technical debt, and recommended next steps.

---

## 1. High-Level Summary

The application is a React + TypeScript + Vite-based workflow visualizer that:

- Accepts a JSON "Workflow" definition (in-memory, edited live through a JSON editor panel)
- Parses it into React Flow nodes + edges using a heuristic mapping
- Renders an interactive graph where each workflow state is a custom node
- Displays expandable form field metadata inside nodes
- Provides a details side panel (for future deep inspection)

Phase 2 (dynamic form runtime + action execution) is NOT implemented yet; only graph visualization, live JSON editing, and export utilities are in place.

Status snapshot:

- Dev server: Vite (scripts: `npm run dev`)
- TypeScript: enabled, some looseness (index signatures, `any` in places / suggested improvements not yet addressed)
- Graph rendering: functional for the default workflow
- JSON editor: functional; updates graph after applying valid JSON
- Error handling: basic parse error message only
- Build: `npm run build` should run (production build not verified in this session post-edits, but config is standard)
- Lint/type suggestions: Several advisory issues (keys, any, index signature) remain unrefined

---

## 2. Technology Stack

| Concern          | Choice                             | Notes                                                       |
| ---------------- | ---------------------------------- | ----------------------------------------------------------- |
| UI Framework     | React 19 + TypeScript              | Modern function components, hooks                           |
| Bundler/Dev      | Vite 7                             | Fast HMR, ESM                                               |
| Graph Library    | React Flow (`reactflow`)           | Custom node type: `stateNode`                               |
| Icons            | `lucide-react`                     | Lightweight icon set                                        |
| Layout Heuristic | Manual grid (not ELK yet)          | Basic x/y spacing only                                      |
| Export (planned) | `html-to-image` (imported)         | Export button currently only downloads JSON graph structure |
| Parsing          | Custom util `parseWorkflowToGraph` | Creates nodes + inferred edges                              |

Note: Both `reactflow` and `@xyflow/react` packages are installed. Only `reactflow` is currently used (provider + components). The `@xyflow/react` dependency may be removed if unused.

---

## 3. Data & Types

Defined in `src/types/workflow.types.ts`:

- `Field { ID, Name, Type, DataSource, Actions[] }`
- `Form { Fields: Field[] }`
- `State { Form?: Form; [key:string]: any }` (index signature used to allow future extensions)
- `Action { NextState, Operation }`
- `Workflow { States: Record<string,State>; Actions: Record<string,Action> }`
- `WorkflowConfig { Workflow }`
- Graph convenience interfaces (`GraphNode`, `GraphEdge`) used conceptually (actual React Flow `Node`/`Edge` types come from lib)

Potential improvements:

- Replace `[key: string]: any` with a discriminated union or stricter extension field shape
- Add enums or union literals for field `Type`
- Introduce a JSON Schema (for validation + editor assistance)

---

## 4. Workflow Parsing Logic

File: `src/utils/graphParser.ts`
Responsibilities:

1. Validate presence of `config.Workflow` (gracefully returns empty sets if absent)
2. Convert each `State` into a React Flow node:
   - Positioning: naive row/column grid (3 columns, fixed spacing constants)
   - Node type: `stateNode`
   - Data payload: includes original state object, hasForm flag, fields array
3. Build edges from `Actions` object:
   - Infers source state via `findSourceState(actionName, stateKeys)` using name heuristics (contains state name, or fallback rules: finalize/submit → previous, review/approve → last, else first)
   - Each explicit action edge labeled with action name, styled (blue stroke), animated
4. Adds implicit “Next” dashed edges between sequential states if an explicit action-driven edge does not already connect them

Limitations:

- Source inference is heuristic and prone to mis-association for ambiguous action names
- No cycle detection or validation of unreachable states
- No concept of initial or terminal state semantics beyond order
- No layout engine (ELK not yet integrated) meaning large graphs may overlap visually

---

## 5. UI Component Architecture

| Component       | Purpose                                                                                      | Key Props / State                             |
| --------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `App`           | Top-level orchestrator: manages JSON text, parsed workflow, toggles editor                   | `workflow`, `jsonText`, `error`, `showEditor` |
| `WorkflowGraph` | Wraps React Flow, manages node/edge state & selection, export button, integrates DetailPanel | internal `nodes`, `edges`, selection state    |
| `StateNode`     | Custom node renderer: expandable form field list, dynamic style on selection                 | local `expanded` state; expects `data.fields` |
| `JsonEditor`    | Textarea-based JSON editor with validation & apply button                                    | `value`, `onChange`, `onApply`, `error`       |
| `DetailPanel`   | Displays selected node or edge details (basic rendering)                                     | `selectedNode`, `selectedEdge`                |

Interaction Flow:

1. App renders with default workflow (from `getDefaultWorkflow`) => parse → nodes/edges
2. User edits JSON → clicks Apply → parse reruns → React Flow re-renders
3. Clicking node/edge updates selection in `WorkflowGraph`; `DetailPanel` shows details
4. Expanding a node reveals its form fields and associated field actions

---

## 6. State Management

- Local component state only (React `useState`) — no global store
- JSON editor state is the single source of truth for the current workflow (mirrored into `workflow` once parsed successfully)
- React Flow internal helpers (`useNodesState`, `useEdgesState`) manage graph-level changes (currently minimal dynamic editing)

---

## 7. Build & Run

Scripts in `package.json`:

- `npm run dev` — Start Vite dev server (HMR)
- `npm run typecheck` — Run TypeScript compiler in noEmit mode
- `npm run build` — Composite build: `tsc -b` then `vite build`
- `npm run preview` — Preview production bundle
- `npm run lint` — Run eslint (rules currently surface suggestions/warnings)

Typical workflow:

```bash
npm install
npm run dev
# Open http://localhost:5173/
```

Production build (expected):

```bash
npm run build
npm run preview
```

---

## 8. Current Strengths

- Clear modular separation (types, parsing, components)
- Fast iteration loop via Vite + simple JSON-driven architecture
- Extendable node data model (custom node component already in place)
- Straightforward on-ramp for Phase 2 (form rendering) inside each state node or dedicated panel

---

## 9. Known Issues / Limitations

| Category     | Item                                                                     | Impact                              | Suggested Fix                                                            |
| ------------ | ------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------ |
| Types        | Index signature + `any` usage in `State`                                 | Reduces safety                      | Introduce explicit optional fields or `Record<string, unknown>`          |
| Types        | No validation of workflow JSON shape                                     | Runtime parse errors only           | Add JSON Schema + validator (Ajv or Zod)                                 |
| Graph        | Heuristic action source resolution                                       | Possible incorrect edges            | Extend JSON spec to include `SourceState` or maintain mapping in Actions |
| Graph        | Static grid layout                                                       | Overlap in large workflows          | Integrate ELK (`elkjs`) for auto layout                                  |
| UX           | Array index keys in lists                                                | React reconciliation inefficiencies | Use stable IDs (field.ID)                                                |
| UX           | No filtering/search of nodes                                             | Harder navigation in large graphs   | Add search input + highlight                                             |
| UX           | Narrow error feedback in JSON editor                                     | Poor user understanding             | Show line/column from parser exception                                   |
| Performance  | Re-parse entire workflow on each apply                                   | Acceptable now                      | Consider diffing or memoization later                                    |
| Design       | Mixed responsibility in `WorkflowGraph` (selection + export + rendering) | Harder to extend                    | Factor out selection context / toolbar                                   |
| Dependencies | Unused `@xyflow/react` dependency                                        | Bloat                               | Remove if not adopting new package version                               |

---

## 10. Security & Reliability Considerations

- All data is client-side; no persistence or network I/O
- No sanitization concerns currently (JSON input is local) but future remote loading should sanitize/validate
- Large JSON could impact performance (no virtualization in lists yet)

---

## 11. Extensibility Paths (Phase 2 & Beyond)

| Area              | Enhancement                    | Approach                                                            |
| ----------------- | ------------------------------ | ------------------------------------------------------------------- |
| Form Runtime      | Render dynamic forms per state | Introduce `FormRenderer` component reading `State.Form.Fields`      |
| Validation        | Field & cross-field validators | Define registry of action handlers; run on change or submit         |
| Actions           | Execution pipeline             | Map action tokens to async handlers (validate, fetch, notify, etc.) |
| State Transitions | Runtime engine                 | Maintain current state pointer + event dispatch for actions         |
| Persistence       | Save workflows                 | LocalStorage or backend REST sync                                   |
| Versioning        | Workflow revisions             | Introduce metadata (id, version, createdAt)                         |
| Testing           | Snapshot graph structure       | Add Jest + serialization test for parser                            |
| Export            | PNG / SVG export               | Use existing `html-to-image` or React Flow built-in utilities       |

---

## 12. Recommended Immediate Next Steps

| Priority | Task                                              | Rationale                          |
| -------- | ------------------------------------------------- | ---------------------------------- |
| High     | Remove unused `@xyflow/react` if confirmed unused | Reduce bundle size/confusion       |
| High     | Add JSON schema & validation feedback             | Improve usability & correctness    |
| Medium   | Replace index keys with stable IDs                | Prevent subtle UI bugs             |
| Medium   | Introduce layout engine (ELK) toggle              | Handle larger workflows gracefully |
| Medium   | Tighten types (remove `[key:string]: any`)        | Improve refactor safety            |
| Low      | Add graph search/filter                           | Usability for larger definitions   |
| Low      | Add unit test for `parseWorkflowToGraph`          | Prevent regressions                |

---

## 13. File Map (Key Files)

| Path                               | Role                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| `src/App.tsx`                      | Root component controlling editor + graph             |
| `src/main.tsx`                     | Vite entry; wraps App in `ReactFlowProvider`          |
| `src/components/WorkflowGraph.tsx` | Graph wrapper (selection, export, panel)              |
| `src/components/StateNode.tsx`     | Custom node renderer                                  |
| `src/components/DetailPanel.tsx`   | Displays selected node/edge details                   |
| `src/components/JsonEditor.tsx`    | JSON editing UI                                       |
| `src/utils/graphParser.ts`         | Core conversion logic + default workflow              |
| `src/types/workflow.types.ts`      | Shared type contracts                                 |
| `README.md`                        | Public-facing project overview & spec doc             |
| `STATE.md`                         | (This file) Canonical current technical state summary |

---

## 14. Glossary

| Term         | Definition                                                              |
| ------------ | ----------------------------------------------------------------------- |
| Workflow     | Container holding States + Actions definition objects                   |
| State        | A named stage in the workflow that may contain a form                   |
| Action       | A named transition leading to a NextState with an Operation description |
| Field        | A form input specification within a State.Form.Fields array             |
| Node (Graph) | Visual representation of a State in React Flow                          |
| Edge (Graph) | Visual transition generated from an Action or implicit sequence         |

---

## 15. Validation Checklist (Current Build)

| Status | Item |
| ------ | ---- |

[ ] Production build manually verified (pending)
[x] Dev server launches (Vite)
[x] Default workflow parses without error
[x] Graph nodes render with field expansion
[x] JSON editor updates workflow
[ ] Error reporting enhanced (basic only)
[ ] Layout engine integrated

---

## 16. Meta / Maintenance

Keep this file updated when:

- Changing the workflow JSON schema
- Introducing form runtime logic
- Replacing layout or graph library
- Adding persistence or backend integration

Suggested automation: Add a CI step to diff `STATE.md` when core architectural files change (parse workflow, node component, or types) to remind maintainers to refresh documentation.

---

## 17. Quick Start (Condensed)

```bash
npm install
npm run dev
# Edit JSON in left panel, click Apply
# Interact with graph on right
```

---

## 18. License & Ownership

Currently MIT (see `README.md`). Confirm organizational licensing before external distribution if this project evolves beyond prototype.

---

## 19. Open Questions

- Should Actions explicitly define source state(s) instead of heuristic inference?
- How will field-level actions map to runtime side effects (e.g., service calls)?
- Do we need workflow version migrations?
- What is the minimum viable audit trail for transitions?

---

_End of STATE.md_
