# Proposed Feature-Based Project Structure

This document outlines a proposed restructuring of the Loan Workflow UI project to improve modularity, maintainability, and scalability by organizing code around features rather than technical layers.

## Current Structure Issues

The current project structure has several limitations:

1. Components are organized by type (graph, form, table) rather than by feature
2. Related files (components, types, utils) are scattered across different directories
3. Shared utilities and types are not clearly grouped with their related features
4. It's difficult to understand feature boundaries and relationships
5. Adding new features requires changes across multiple directories

## Proposed Structure

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

## Feature Descriptions

### Dashboard Feature
**Purpose**: Application queue management and overview

**Components**:
- Dashboard.tsx - Main dashboard view
- DashboardHeader.tsx - Header with search and filters
- ApplicationTable.tsx - Table displaying applications
- ApplicationRow.tsx - Individual application row
- ResultsCount.tsx - Results counter component
- TopBar.tsx - Navigation bar

**Assets**: 
- Feature-specific icons or images

### Workflow Feature
**Purpose**: Visual workflow representation and editing

**Components**:
- WorkflowGraph.tsx - Main graph visualization
- StateNode.tsx - Individual state nodes
- DetailPanel.tsx - Information panel for selected elements
- GraphToolbar.tsx - Toolbar with graph actions
- JsonEditor.tsx - JSON workflow editor
- README.md - Feature documentation

**Utils**:
- graphParser.ts - Converts JSON to graph structure
- export.ts - Export functionality
- graphExport.ts - Graph-specific export utilities

**Assets**:
- Workflow icons or graphics

### Application Details Feature
**Purpose**: Detailed view of individual loan applications

**Components**:
- ApplicationDetails.tsx - Main application details view
- ApplicationHeader.tsx - Header with application info
- WorkflowProgress.tsx - Progress tracking component
- ContactInfo.tsx - Contact information display
- FinancialDetails.tsx - Financial information display
- RiskSnapshot.tsx - Risk assessment display
- DocumentsSection.tsx - Document management section
- AuditTrail.tsx - Audit trail display

**Assets**:
- Icons for document types
- Risk indicator graphics

### Form Feature
**Purpose**: Dynamic form rendering and management

**Components**:
- FormViewer.tsx - Main form rendering component
- FieldInput.tsx - Individual field input component

**Assets**:
- Form-specific icons or validation graphics

### Shared
**Purpose**: Truly shared components, types, and utilities used across multiple features

**Components**:
- Common UI components (buttons, modals, etc.)

**Types**:
- Global type definitions

**Utils**:
- colors.ts - Color palette utilities
- download.ts - File download utilities

**Assets**:
- Global icons
- Brand assets

## Benefits of Feature-Based Structure

1. **Improved Modularity**: Each feature is self-contained with its own components, types, and utilities
2. **Better Scalability**: Easy to add new features without cluttering existing directories
3. **Enhanced Maintainability**: Changes to a feature only affect its own directory
4. **Clearer Feature Boundaries**: Easy to understand what belongs to which feature
5. **Simplified Navigation**: Related files are grouped together
6. **Easier Testing**: Each feature can be tested in isolation
7. **Better Code Ownership**: Teams can own specific features
8. **Faster Onboarding**: New developers can understand features in isolation

## Migration Strategy

### Phase 1: Directory Structure
1. Create the new feature directories
2. Move components to their respective feature directories
3. Consolidate related types and utilities with their features
4. Keep truly shared components/utils in the shared directory

### Phase 2: Path Updates
1. Update all import paths throughout the application
2. Update any build or configuration files that reference paths

### Phase 3: Testing and Validation
1. Run all tests to ensure nothing is broken
2. Perform manual testing of all features
3. Verify build process works correctly

### Phase 4: Documentation
1. Update any documentation that references the old structure
2. Add README files to each feature directory
3. Update any internal documentation

## Implementation Considerations

1. **Git History**: Moving files will preserve git history when done correctly
2. **IDE Support**: Most modern IDEs will automatically update imports when files are moved
3. **Build Process**: Ensure the build process supports the new structure
4. **Testing**: All tests should continue to pass after the migration
5. **Deployment**: Verify that deployment processes are unaffected

This restructuring will significantly improve the maintainability and scalability of the Loan Workflow UI application as it continues to grow and evolve.