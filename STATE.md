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
- Navigation to application details
```

**`WorkflowGraph.tsx`** - Visual Workflow

- Renders React Flow canvas
- Handles node/edge interactions
- Export functionality
- Controls (zoom, pan, minimap)

**`StateNode.tsx`** - Node Component

- Displays state name
- Shows field count
- Expandable field list
- Visual selection indicator

**`DetailPanel.tsx`** - Information Panel

- Shows selected node/edge details
- Lists form fields
- "Form View" button for navigation
- Displays state actions & operations

**`FormViewer.tsx`** - Dynamic Forms

- Renders fields based on State.Form
- Handles all field types
- Edit/Read modes
- Action buttons (Submit, Reject, Approve)

**`JsonEditor.tsx`** - Configuration Editor

- JSON syntax validation
- Real-time error feedback
- Apply changes to workflow

## Data Flow

```
1. JSON Definition (States + Actions)
       ↓
2. Parser creates graph structure
       ↓
3. React Flow renders visual workflow
       ↓
4. User interactions:
   - Click node → Detail panel → Form view
   - Dashboard → Select application → View state
   - Form actions → Trigger state transitions
```

## State Transitions

Each State contains Actions that define transitions:

```json
"RMReview": {
  "Actions": {
    "RMReject": {
      "NextState": "ARMDraft",
      "Operation": "Send back with corrections"
    },
    "RMFinalize": {
      "NextState": "TeamHeadBusinessReview",
      "Operation": "Forward for approval"
    }
  }
}
```

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

1. **Application starts** at first state (ApplicationRequest)
2. **User fills form** with required fields
3. **Actions trigger** state transitions
4. **Each transition** executes operations (notify, validate, assign)
5. **Application moves** through states until Completed

## Key Features

- **Dynamic Forms**: Generated from JSON configuration
- **Visual Workflow**: Real-time graph from JSON
- **Multi-path Support**: Approve/Reject at each stage
- **Role-based Actions**: Different operations per actor
- **Audit Trail**: Track application through states
- **Document Management**: File upload/validation per state

## Use Cases

1. **Loan Officer**: Submit initial application
2. **RM**: Review and finalize proposal
3. **Team Head**: Approve or request changes
4. **Credit Manager**: Risk assessment
5. **CRO/CEO**: Final approval based on amount

The system provides complete workflow automation from application to disbursement with visual tracking and dynamic form generation.
