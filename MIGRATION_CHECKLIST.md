# Migration Checklist

This document tracks the remaining items to complete the migration from legacy directories to the feature-based structure.

## Components to Migrate

### Dashboard Feature
- [ ] Move `src/components/Dashboard.tsx` to `src/features/dashboard/components/`
- [ ] Move `src/components/DashboardHeader.tsx` to `src/features/dashboard/components/`
- [ ] Move `src/components/ApplicationTable.tsx` to `src/features/dashboard/components/`
- [ ] Move `src/components/ApplicationRow.tsx` to `src/features/dashboard/components/`
- [ ] Move `src/components/ResultsCount.tsx` to `src/features/dashboard/components/`
- [ ] Move `src/components/TopBar.tsx` to `src/features/dashboard/components/` (or `src/shared/components/layout/` if shared)

### Workflow Feature
- [ ] Move `src/components/WorkflowGraph.tsx` to `src/features/workflow/components/`
- [ ] Move `src/components/DetailPanel.tsx` to `src/features/workflow/components/`
- [ ] Move `src/components/StateNode.tsx` to `src/features/workflow/components/`
- [ ] Move `src/components/JsonEditor.tsx` to `src/features/workflow/components/`

### Application Details Feature
- [ ] Move `src/components/ApplicationDetails.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/ApplicationHeader.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/WorkflowProgress.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/ContactInfo.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/FinancialDetails.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/RiskSnapshot.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/DocumentsSection.tsx` to `src/features/application-details/components/`
- [ ] Move `src/components/AuditTrail.tsx` to `src/features/application-details/components/`

### Form Feature
- [ ] Move `src/components/FormViewer.tsx` to `src/features/form/components/`

### Shared Components
- [ ] Move `src/components/form/FieldInput.tsx` to `src/shared/components/` or appropriate feature directory
- [ ] Move `src/components/graph/GraphToolbar.tsx` to `src/features/workflow/components/`
- [ ] Move `src/components/table/ApplicationRow.tsx` to `src/features/dashboard/components/` (if not already covered above)

## Types to Migrate
- [ ] Move `src/types/workflow.types.ts` to `src/features/workflow/types/` or `src/shared/types/`

## Utilities to Migrate
- [ ] Move `src/utils/export.ts` to appropriate feature directory or `src/shared/utils/`

## Post-Migration Tasks
- [ ] Update all import paths to use path aliases
- [ ] Implement barrel exports (`index.ts` files) for all component, types, and utils directories
- [ ] Add README.md files to each feature directory documenting its purpose and public API
- [ ] Remove legacy directories (`src/components/`, `src/types/`, `src/utils/`) after confirming all code has been migrated
- [ ] Update any remaining absolute imports to use path aliases
- [ ] Run all tests to ensure nothing is broken
- [ ] Update documentation to reflect completed migration
- [ ] Update `ARCHITECTURE.md` to accurately reflect the current state of the project