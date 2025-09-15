This folder contains small, framework-agnostic components used by the workflow UI:

- WorkflowGraph.tsx - lightweight renderer for a workflow (SVG edges + positioned node components)
- StateNode.tsx - presentational node component
- JsonEditor.tsx - simple JSON editor textarea
- DetailPanel.tsx - right-hand details view for a selected node

These components are intentionally minimal; they avoid introducing heavy runtime deps so they can be used as drop-in placeholders while you iterate on the UI.
