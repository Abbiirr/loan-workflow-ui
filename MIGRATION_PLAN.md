# Migration Plan: Feature-Based Structure

This document outlines the step-by-step plan for migrating the Loan Workflow UI project from its current structure to the proposed feature-based structure.

## Current Structure

```
src/
├── assets/
│   └── react.svg
├── components/
│   ├── form/
│   │   └── FieldInput.tsx
│   ├── graph/
│   │   └── GraphToolbar.tsx
│   ├── table/
│   │   └── ApplicationRow.tsx
│   ├── ApplicationDetails.tsx
│   ├── ApplicationHeader.tsx
│   ├── ApplicationTable.tsx
│   ├── AuditTrail.tsx
│   ├── ContactInfo.tsx
│   ├── Dashboard.tsx
│   ├── Dashboard.types.ts
│   ├── DashboardHeader.tsx
│   ├── DetailPanel.tsx
│   ├── DocumentsSection.tsx
│   ├── FinancialDetails.tsx
│   ├── FormViewer.tsx
│   ├── JsonEditor.tsx
│   ├── README.md
│   ├── ResultsCount.tsx
│   ├── RiskSnapshot.tsx
│   ├── StateNode.tsx
│   ├── TopBar.tsx
│   ├── WorkflowGraph.tsx
│   └── WorkflowProgress.tsx
├── types/
│   └── workflow.types.ts
├── utils/
│   ├── colors.ts
│   ├── download.ts
│   ├── export.ts
│   ├── graphExport.ts
│   └── graphParser.ts
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Target Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── App.css
│   └── routes/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── ApplicationTable.tsx
│   │   │   ├── ApplicationRow.tsx
│   │   │   ├── ResultsCount.tsx
│   │   │   └── TopBar.tsx
│   │   ├── types/
│   │   │   └── dashboard.types.ts
│   │   └── assets/
│   ├── workflow/
│   │   ├── components/
│   │   │   ├── WorkflowGraph.tsx
│   │   │   ├── StateNode.tsx
│   │   │   ├── DetailPanel.tsx
│   │   │   ├── GraphToolbar.tsx
│   │   │   ├── JsonEditor.tsx
│   │   │   └── README.md
│   │   ├── types/
│   │   └── utils/
│   │   │   ├── graphParser.ts
│   │   │   ├── export.ts
│   │   │   └── graphExport.ts
│   │   └── assets/
│   ├── application-details/
│   │   ├── components/
│   │   │   ├── ApplicationDetails.tsx
│   │   │   ├── ApplicationHeader.tsx
│   │   │   ├── WorkflowProgress.tsx
│   │   │   ├── ContactInfo.tsx
│   │   │   ├── FinancialDetails.tsx
│   │   │   ├── RiskSnapshot.tsx
│   │   │   ├── DocumentsSection.tsx
│   │   │   └── AuditTrail.tsx
│   │   ├── types/
│   │   └── assets/
│   ├── form/
│   │   ├── components/
│   │   │   ├── FormViewer.tsx
│   │   │   └── FieldInput.tsx
│   │   ├── types/
│   │   └── assets/
│   └── shared/
│       ├── components/
│       ├── types/
│       ├── utils/
│       │   ├── colors.ts
│       │   └── download.ts
│       └── assets/
├── data/
│   └── sample-loan-workflow.json
├── index.css
└── main.tsx
```

## Migration Steps

### Phase 1: Preparation (1-2 days)

1. Create a feature branch for the migration
2. Update documentation (README.md, CODE_REVIEW.md) to reflect the planned changes
3. Set up linting rules to ensure new code follows the feature-based structure
4. Create a checklist of all files to be moved

### Phase 2: Directory Structure Creation (1 day)

1. Create the new directory structure:
   ```
   src/
   ├── app/
   ├── features/
   │   ├── dashboard/
   │   │   ├── components/
   │   │   ├── types/
   │   │   └── assets/
   │   ├── workflow/
   │   │   ├── components/
   │   │   ├── types/
   │   │   ├── utils/
   │   │   └── assets/
   │   ├── application-details/
   │   │   ├── components/
   │   │   ├── types/
   │   │   └── assets/
   │   ├── form/
   │   │   ├── components/
   │   │   ├── types/
   │   │   └── assets/
   │   └── shared/
   │       ├── components/
   │       ├── types/
   │       ├── utils/
   │       └── assets/
   ```

### Phase 3: Component Migration (3-5 days)

#### Dashboard Feature
1. Move Dashboard-related components:
   - Dashboard.tsx → features/dashboard/components/Dashboard.tsx
   - DashboardHeader.tsx → features/dashboard/components/DashboardHeader.tsx
   - ApplicationTable.tsx → features/dashboard/components/ApplicationTable.tsx
   - ApplicationRow.tsx → features/dashboard/components/ApplicationRow.tsx
   - ResultsCount.tsx → features/dashboard/components/ResultsCount.tsx
   - TopBar.tsx → features/dashboard/components/TopBar.tsx
2. Move Dashboard types:
   - Dashboard.types.ts → features/dashboard/types/dashboard.types.ts

#### Workflow Feature
1. Move Workflow-related components:
   - WorkflowGraph.tsx → features/workflow/components/WorkflowGraph.tsx
   - StateNode.tsx → features/workflow/components/StateNode.tsx
   - DetailPanel.tsx → features/workflow/components/DetailPanel.tsx
   - GraphToolbar.tsx → features/workflow/components/GraphToolbar.tsx
   - JsonEditor.tsx → features/workflow/components/JsonEditor.tsx
   - README.md → features/workflow/components/README.md
2. Move Workflow utilities:
   - graphParser.ts → features/workflow/utils/graphParser.ts
   - export.ts → features/workflow/utils/export.ts
   - graphExport.ts → features/workflow/utils/graphExport.ts

#### Application Details Feature
1. Move Application Details components:
   - ApplicationDetails.tsx → features/application-details/components/ApplicationDetails.tsx
   - ApplicationHeader.tsx → features/application-details/components/ApplicationHeader.tsx
   - WorkflowProgress.tsx → features/application-details/components/WorkflowProgress.tsx
   - ContactInfo.tsx → features/application-details/components/ContactInfo.tsx
   - FinancialDetails.tsx → features/application-details/components/FinancialDetails.tsx
   - RiskSnapshot.tsx → features/application-details/components/RiskSnapshot.tsx
   - DocumentsSection.tsx → features/application-details/components/DocumentsSection.tsx
   - AuditTrail.tsx → features/application-details/components/AuditTrail.tsx

#### Form Feature
1. Move Form components:
   - FormViewer.tsx → features/form/components/FormViewer.tsx
   - FieldInput.tsx → features/form/components/FieldInput.tsx

#### Shared Resources
1. Move shared components:
   - Create shared/components/ directory
   - Identify and move truly shared components (to be determined)
2. Move shared utilities:
   - colors.ts → shared/utils/colors.ts
   - download.ts → shared/utils/download.ts
3. Move shared types:
   - workflow.types.ts → shared/types/workflow.types.ts

### Phase 4: App Structure (1 day)

1. Move App.tsx and App.css to app/ directory
2. Create routing configuration in app/routes/
3. Update main.tsx to bootstrap the new structure

### Phase 5: Import Path Updates (2-3 days)

1. Update all import paths throughout the application:
   - Use find-and-replace or automated tools to update paths
   - Update relative imports to reflect new locations
   - Verify all imports resolve correctly

### Phase 6: Testing and Validation (2-3 days)

1. Run all existing tests to ensure nothing is broken
2. Perform manual testing of all features:
   - Dashboard functionality
   - Workflow graph visualization
   - Form rendering and interactions
   - Application details view
3. Verify build process works correctly
4. Check for any broken links or missing assets

### Phase 7: Documentation Updates (1 day)

1. Update README.md with new structure information
2. Add README files to each feature directory
3. Update any internal documentation
4. Update code comments that reference file paths

## Risk Mitigation

1. **Version Control**: Commit after each phase to allow for easy rollback
2. **Automated Testing**: Ensure all tests pass after each phase
3. **Backup**: Create a backup branch before starting the migration
4. **Incremental Approach**: Migrate one feature at a time rather than all at once
5. **Code Review**: Have team members review changes during the migration

## Timeline

Total estimated time: 2-3 weeks
- Preparation: 1-2 days
- Directory structure: 1 day
- Component migration: 3-5 days
- App structure: 1 day
- Import updates: 2-3 days
- Testing/validation: 2-3 days
- Documentation: 1 day

## Success Criteria

1. All components are organized by feature
2. All import paths are correctly updated
3. All existing functionality works as before
4. Build process completes successfully
5. All tests pass
6. Documentation is updated
7. Team members can easily understand the new structure

## Post-Migration Tasks

1. Set up linting rules to enforce feature-based organization
2. Create contribution guidelines for the new structure
3. Train team members on the new organization
4. Monitor for any issues after deployment