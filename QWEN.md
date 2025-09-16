# Loan Workflow UI - Project Context

This document provides essential context about the Loan Workflow UI project for Qwen Code.

## Project Overview

A web application that transforms JSON workflow specifications into interactive visual graphs and dynamic forms for business process automation, specifically designed for loan approval workflows.

## Core Features

### Phase 1: Graph Visualization (Implemented)
- JSON-to-Graph Conversion: Parses workflow specifications and generates visual flow diagrams
- Interactive Nodes: Displays states with expandable form field information
- Dynamic Edges: Shows actions/transitions between states with operations
- Real-time Editing: Live JSON editor with instant graph updates
- Detail Panel: Click nodes/edges to view detailed properties
- Export Capabilities: Export workflow graphs to JSON

### Phase 2: Form Rendering (Implemented)
- Dynamic Form Generation: Renders forms based on state field definitions
- Field Type Support: Text, number, select, textarea, file uploads
- Data Binding: Connects to data sources via template syntax (`{{ data.field }}`)
- Action Handlers: Executes field-level actions (save, validate, upload, etc.)
- State Transitions: Navigate between forms following workflow logic
- Edit/Save Mode: Toggle between view and edit modes for forms

### Phase 3: Application Management (Implemented)
- Dashboard View: Queue management for loan applications with filtering and search
- Application Details: Detailed view of loan applications with progress tracking
- Document Management: Upload, view, and manage application documents
- Audit Trail: Track all actions and comments on applications
- Workflow Navigation: Move between different workflow states

## Technical Architecture

### Core Data Types
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

### Key Components
- `App.tsx` - Application Controller managing view modes
- `Dashboard.tsx` - Queue management for loan applications
- `WorkflowGraph.tsx` - Visual workflow rendering with React Flow
- `StateNode.tsx` - Node component for workflow states
- `DetailPanel.tsx` - Information panel for selected nodes/edges
- `FormViewer.tsx` - Dynamic form rendering component
- `JsonEditor.tsx` - Configuration editor for workflow JSON
- `ApplicationHeader.tsx` - Header component for application details view
- `ApplicationDetails.tsx` - Main component for displaying application details
- `WorkflowProgress.tsx` - Component for displaying workflow progress
- `ContactInfo.tsx` - Component for displaying contact information
- `FinancialDetails.tsx` - Component for displaying financial details
- `RiskSnapshot.tsx` - Component for displaying risk snapshot
- `DocumentsSection.tsx` - Component for managing documents
- `AuditTrail.tsx` - Component for displaying audit trail
- `utils/graphParser.ts` - Converts workflow JSON to React Flow nodes/edges

### Data Flow
1. JSON Definition (States + Actions)
2. Parser creates graph structure
3. React Flow renders visual workflow
4. User interactions:
   - Click node → Detail panel → Form view
   - Dashboard → Select application → View state
   - Form actions → Trigger state transitions

## File Structure
```
loan-workflow-ui/
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── Dashboard.tsx
│   │   ├── WorkflowGraph.tsx
│   │   ├── StateNode.tsx
│   │   ├── DetailPanel.tsx
│   │   ├── FormViewer.tsx
│   │   └── JsonEditor.tsx
│   ├── types/
│   │   └── workflow.types.ts
│   ├── utils/
│   │   └── graphParser.ts
│   └── ...
├── data/
│   └── sample-loan-workflow.json
└── ...
```

*Note: The project has been refactored to a feature-based structure as documented in [ARCHITECTURE.md](ARCHITECTURE.md). See [MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md) for remaining items to complete the migration.*

## Views & Navigation

### Dashboard View
- Lists all loan applications
- Shows current state/assignee
- Quick status overview
- Bulk operations

### Graph View
- Visual workflow representation
- Interactive nodes/edges
- Click navigation to forms
- Export capabilities

### Form View
- Dynamic field rendering
- Validation based on FieldActions
- State-specific action buttons
- Progress through workflow

## Workflow Execution

1. Application starts at first state (ApplicationRequest)
2. User fills form with required fields
3. Actions trigger state transitions
4. Each transition executes operations (notify, validate, assign)
5. Application moves through states until Completed

## Supported Use Cases
- Loan approval workflows
- Multi-level approval processes
- Document review systems
- Any state-based business process

## Technology Stack
- React + TypeScript
- React Flow (graph visualization)
- JSON-based configuration
- Export capabilities (JSON, PNG)