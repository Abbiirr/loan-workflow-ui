# Workflow Visualizer & Form Renderer

## Overview

A web application that transforms JSON workflow specifications into interactive visual graphs and dynamic forms for business process automation.

## Core Features

### Phase 1: Graph Visualization (Current)

- **JSON-to-Graph Conversion**: Parses workflow specifications and generates visual flow diagrams
- **Interactive Nodes**: Displays states with expandable form field information
- **Dynamic Edges**: Shows actions/transitions between states with operations
- **Real-time Editing**: Live JSON editor with instant graph updates
- **Detail Panel**: Click nodes/edges to view detailed properties

### Phase 2: Form Rendering (Upcoming)

- **Dynamic Form Generation**: Renders forms based on state field definitions
- **Field Type Support**: Text, number, select, textarea, file uploads
- **Data Binding**: Connects to data sources via template syntax (`{{ data.field }}`)
- **Action Handlers**: Executes field-level actions (validate, calculate, fetch)
- **State Transitions**: Navigate between forms following workflow logic

## Technical Specifications

### Input Format

```json
{
  "Workflow": {
    "States": {
      "StateName": {
        "Form": {
          "Fields": [...]
        }
      }
    },
    "Actions": {
      "ActionName": {
        "NextState": "TargetState",
        "Operation": "Operations list"
      }
    }
  }
}
```

### Supported Use Cases

- Loan approval workflows
- Multi-level approval processes
- Document review systems
- Any state-based business process

## Benefits

- **Visual Understanding**: Complex workflows become clear diagrams
- **No-Code Configuration**: Define workflows via JSON without programming
- **Rapid Prototyping**: Test workflow logic before implementation
- **Documentation**: Auto-generated visual documentation of business processes

## Technology Stack

- React + TypeScript
- React Flow (graph visualization)
- JSON-based configuration
- Export capabilities (JSON, PNG)

---

# Workflow Specification Documentation

## JSON Structure Overview

The workflow specification defines states (nodes) and transitions (edges) in a business process.

## Core Components

### 1. States Object

Each key represents a workflow state/stage. States can have forms or be empty.

```json
"States": {
  "StateName": {
    "Form": { ... }  // Optional form configuration
  }
}
```

### 2. Form Configuration

Defines user interface elements for data collection at each state.

#### Field Properties:

- **ID**: Unique identifier for backend processing
- **Name**: Display label for users
- **Type**: Input control type
  - `text`: Single-line text
  - `textarea`: Multi-line text
  - `number`: Numeric input
  - `select`: Dropdown selection
  - `file`: File upload
  - `date`: Date picker
  - `checkbox`: Boolean selection
- **DataSource**: Template binding for data population

  - Format: `{{ data.path.to.field }}`
  - Enables pre-filling from existing data
  - Supports nested object paths

- **Actions**: Field-level operations
  - `validate`: Input validation
  - `calculate`: Compute derived values
  - `fetch`: Load external data
  - `autofill`: Auto-populate related fields
  - `upload`: Handle file uploads
  - `notify`: Trigger notifications

### 3. Actions Object

Defines transitions between states and associated operations.

```json
"Actions": {
  "ActionName": {
    "NextState": "TargetStateName",
    "Operation": "Comma-separated list of operations"
  }
}
```

#### Action Properties:

- **NextState**: Target state after action execution
- **Operation**: Business logic executed during transition
  - Examples: "Validate, Save to database, Send email, Generate PDF"

## Workflow Execution Flow

1. **State Entry**: System renders form defined in current state
2. **User Input**: Fields collect data per configuration
3. **Field Actions**: Execute immediate operations (validate, calculate)
4. **State Action**: User triggers transition (button click)
5. **Operations**: System executes defined operations
6. **State Transition**: Move to NextState
7. **Repeat**: Process continues until reaching terminal state

## Graph Visualization Rules

- **Nodes**: Each State becomes a graph node
- **Edges**: Actions create directed edges between states
- **Edge Labels**: Action names appear on transition arrows
- **Node Content**: Shows form fields if present
- **Empty States**: Displayed as terminal or pass-through nodes

## Example: Loan Approval

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
      "Completed": {} // Terminal state, no form
    },
    "Actions": {
      "Submit": {
        "NextState": "Review",
        "Operation": "Validate data, Calculate risk score, Notify reviewer"
      },
      "Approve": {
        "NextState": "Completed",
        "Operation": "Update status, Generate contract, Send email"
      },
      "Reject": {
        "NextState": "Application",
        "Operation": "Log rejection, Notify applicant, Reset form"
      }
    }
  }
}
```

## Advanced Features

### Conditional Routing

Actions can implement business rules for dynamic NextState selection based on form data.

### Parallel Workflows

Multiple Actions from same state enable branching paths.

### Validation Rules

Field Actions can enforce complex business constraints before state transitions.

### Data Persistence

DataSource bindings maintain form state across workflow navigation.

---

## Roadmap

- [ ] Phase 1 polish: zoom, pan, export PNG
- [ ] JSON schema validation & helpful errors
- [ ] Form runtime engine (Phase 2)
- [ ] Pluggable action handlers
- [ ] Versioned workflow definitions
- [ ] Persistence layer integration examples

## Quick Start (Dev)

1. Clone repo & install deps
2. Place a workflow JSON in the editor panel (sample above)
3. Observe live graph rendering
4. (Upcoming) Interact with generated forms

## Contributing

PRs welcome once core graph is stable. Please include example JSON updates when adding new capabilities.

## License

MIT (subject to change pending organizational requirements)

---

_This document will evolve as Phase 2 (Form Rendering) is implemented._
