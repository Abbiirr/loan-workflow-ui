# Loan Workflow UI - Project Plan

This document outlines the plan for structuring the Loan Workflow UI project, writing remaining components, wiring everything together, handling navigation, and integrating with APIs.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Remaining Components](#remaining-components)
3. [Component Wiring](#component-wiring)
4. [Navigation](#navigation)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Testing Strategy](#testing-strategy)
8. [Deployment](#deployment)

## Project Structure

```
loan-workflow-ui/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main application component
│   │   ├── App.css              # Main application styles
│   │   └── routes/              # Routing configuration
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx        # Dashboard view with application queue
│   │   │   │   ├── DashboardHeader.tsx  # Header with search and filters
│   │   │   │   ├── ApplicationTable.tsx # Table displaying applications
│   │   │   │   ├── ApplicationRow.tsx   # Individual application row
│   │   │   │   ├── ResultsCount.tsx     # Results counter component
│   │   │   │   └── TopBar.tsx           # Navigation bar
│   │   │   ├── types/
│   │   │   │   └── dashboard.types.ts   # Dashboard-specific types
│   │   │   └── assets/                  # Dashboard-specific assets
│   │   ├── workflow/
│   │   │   ├── components/
│   │   │   │   ├── WorkflowGraph.tsx    # Workflow visualization
│   │   │   │   ├── StateNode.tsx        # Individual state nodes in the graph
│   │   │   │   ├── DetailPanel.tsx      # Details panel for nodes/edges
│   │   │   │   ├── GraphToolbar.tsx     # Toolbar with graph actions
│   │   │   │   ├── JsonEditor.tsx       # Workflow JSON editor
│   │   │   │   └── README.md            # Feature documentation
│   │   │   ├── types/                   # Workflow-specific types
│   │   │   ├── utils/
│   │   │   │   ├── graphParser.ts       # Workflow to graph converter
│   │   │   │   ├── export.ts            # Export functionality
│   │   │   │   └── graphExport.ts       # Graph-specific export utilities
│   │   │   └── assets/                  # Workflow-specific assets
│   │   ├── application-details/
│   │   │   ├── components/
│   │   │   │   ├── ApplicationDetails.tsx # Application details view
│   │   │   │   ├── ApplicationHeader.tsx  # Header for application details
│   │   │   │   ├── WorkflowProgress.tsx   # Progress indicator
│   │   │   │   ├── ContactInfo.tsx        # Contact information section
│   │   │   │   ├── FinancialDetails.tsx   # Financial details section
│   │   │   │   ├── RiskSnapshot.tsx       # Risk assessment section
│   │   │   │   ├── DocumentsSection.tsx   # Document management section
│   │   │   │   └── AuditTrail.tsx         # Audit trail section
│   │   │   ├── types/                     # Application details types
│   │   │   └── assets/                    # Application details assets
│   │   ├── form/
│   │   │   ├── components/
│   │   │   │   ├── FormViewer.tsx         # Dynamic form renderer
│   │   │   │   └── FieldInput.tsx         # Individual field input component
│   │   │   ├── types/                     # Form-specific types
│   │   │   └── assets/                    # Form-specific assets
│   │   └── shared/
│   │       ├── components/                # Truly shared UI components
│   │       │   ├── Button.tsx
│   │       │   ├── Input.tsx
│   │       │   ├── Select.tsx
│   │       │   └── Modal.tsx
│   │       ├── types/                     # Global type definitions
│   │       ├── utils/                     # Shared utilities
│   │       │   ├── colors.ts              # Color palette utilities
│   │       │   └── download.ts            # File download utilities
│   │       └── assets/                    # Global assets
│   ├── hooks/
│   │   ├── useWorkflow.ts       # Custom hook for workflow logic
│   │   └── useApplications.ts   # Custom hook for applications data
│   ├── services/
│   │   └── api.ts               # API service layer
│   ├── contexts/
│   │   └── AppContext.tsx       # Global application context
│   ├── styles/
│   │   └── globals.css          # Global styles
│   └── constants/
│       └── routes.ts            # Route constants
├── data/
│   └── sample-loan-workflow.json # Sample workflow data
├── public/
└── tests/
    ├── components/
    ├── utils/
    └── integration/
```

This feature-based structure organizes code around business capabilities rather than technical layers, making it easier to navigate and maintain as the application grows. For details on this structure, see [PROPOSED_STRUCTURE.md](PROPOSED_STRUCTURE.md).

## Remaining Components

### 1. Reusable UI Components
- Button: Standard button component with variants
- Input: Text input with validation
- Select: Dropdown component
- Modal: Modal dialog component
- Card: Card container component
- Tabs: Tabbed interface component
- Accordion: Collapsible content component

### 2. Application Management Components
- ApplicationList: List view of applications
- ApplicationFilters: Filtering controls for applications
- ApplicationCard: Individual application card
- StatusBadge: Status indicator component
- AssigneeSelector: Component for assigning applications

### 3. Form Components
- FormField: Generic form field component
- TextField: Text input field
- NumberField: Number input field
- SelectField: Dropdown field
- TextAreaField: Multi-line text field
- FileUploadField: File upload component
- FormActions: Form action buttons (Save, Submit, etc.)

### 4. Workflow Components
- ActionButton: Button for workflow actions
- StateTransition: Visual representation of state transitions
- WorkflowToolbar: Toolbar for workflow actions
- GraphControls: Controls for the graph visualization

### 5. Document Management Components
- DocumentList: List of documents
- DocumentUpload: Document upload component
- DocumentViewer: Document preview component
- DocumentStatus: Document status indicator

### 6. Notification Components
- Toast: Toast notification component
- Alert: Alert message component
- NotificationBell: Notification indicator

## Component Wiring

### App Component
The App component serves as the main controller:
1. Manages global state (current view, selected application, workflow data)
2. Handles routing between different views
3. Integrates with context providers
4. Renders the appropriate view based on state

### Dashboard View
1. Dashboard component fetches application data
2. Renders ApplicationList with ApplicationCard components
3. Uses ApplicationFilters for filtering
4. Handles application selection to navigate to details

### Workflow Graph View
1. WorkflowGraph receives workflow data from App
2. Uses graphParser to convert workflow to nodes/edges
3. Renders StateNode components for each state
4. Handles node/edge selection to show DetailPanel
5. Integrates with FormViewer for form visualization

### Application Details View
1. ApplicationDetails receives application data
2. Renders ApplicationHeader for basic info
3. Shows WorkflowProgress for current status
4. Includes ContactInfo, FinancialDetails, RiskSnapshot
5. Renders DocumentsSection and AuditTrail

### Form View
1. FormViewer receives state definition
2. Dynamically renders form fields based on state.Form.Fields
3. Handles field actions (save, validate, etc.)
4. Provides navigation back to graph view

## Navigation

### View Navigation
1. Dashboard ↔ Workflow Graph ↔ Form View ↔ Application Details
2. Use React Router for client-side routing
3. Maintain state when navigating between views
4. Preserve workflow context when switching between graph and form views

### Workflow Navigation
1. State transitions through action buttons
2. Form actions that trigger state changes
3. Visual navigation through the graph
4. Back/forward navigation in form views

### Data Navigation
1. Application selection in dashboard
2. Node selection in workflow graph
3. Document selection in documents section
4. Audit entry selection in audit trail

## API Integration

### Service Layer
1. Create api.ts service for all HTTP requests
2. Implement CRUD operations for applications
3. Handle workflow definitions
4. Manage document uploads/downloads
5. Implement error handling and retry logic

### API Endpoints
1. Applications:
   - GET /api/applications - List applications
   - GET /api/applications/:id - Get application details
   - PUT /api/applications/:id - Update application
   - POST /api/applications - Create new application

2. Workflows:
   - GET /api/workflows - List workflows
   - GET /api/workflows/:id - Get workflow definition
   - PUT /api/workflows/:id - Update workflow
   - POST /api/workflows - Create new workflow

3. Documents:
   - GET /api/documents/:applicationId - List documents
   - POST /api/documents - Upload document
   - GET /api/documents/:id - Download document
   - DELETE /api/documents/:id - Delete document

4. Audit Trail:
   - GET /api/audit/:applicationId - Get audit trail

### Data Synchronization
1. Implement optimistic updates for better UX
2. Handle offline scenarios with local storage
3. Use WebSockets for real-time updates
4. Implement pagination for large datasets

## State Management

### Global State
1. Use React Context for global application state
2. Store current view, selected application, workflow data
3. Manage user preferences and settings
4. Handle notifications and alerts

### Component State
1. Use useState and useReducer for local component state
2. Implement custom hooks for complex state logic
3. Use React Query for server state management
4. Implement proper state normalization

### State Persistence
1. Persist user preferences in localStorage
2. Cache workflow definitions for faster loading
3. Save form drafts to prevent data loss
4. Implement proper cleanup of unused state

## Testing Strategy

### Unit Tests
1. Test individual components with React Testing Library
2. Mock API calls for component tests
3. Test utility functions and helpers
4. Test custom hooks

### Integration Tests
1. Test component interactions
2. Test API integration with mocked endpoints
3. Test navigation between views
4. Test form validation and submission

### End-to-End Tests
1. Test complete user workflows
2. Test dashboard to application details flow
3. Test workflow graph to form view navigation
4. Test document upload and management

### Performance Tests
1. Test rendering performance of large graphs
2. Test form rendering with many fields
3. Test application list with many items
4. Test API response times

## Deployment

### Build Process
1. Optimize bundle size with code splitting
2. Implement lazy loading for components
3. Use environment variables for configuration
4. Set up CI/CD pipeline

### Hosting
1. Deploy to cloud platform (Vercel, Netlify, or similar)
2. Set up CDN for static assets
3. Configure custom domain
4. Implement SSL certificates

### Monitoring
1. Set up error tracking (Sentry or similar)
2. Implement performance monitoring
3. Set up logging for API calls
4. Monitor user interactions and flows

### Security
1. Implement proper authentication
2. Sanitize user inputs
3. Validate API responses
4. Set up CSP and other security headers