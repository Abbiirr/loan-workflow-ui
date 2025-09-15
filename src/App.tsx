import { useState } from "react";
import WorkflowGraph from "./components/WorkflowGraph";
import FormViewer from "./components/FormViewer";
import JsonEditor from "./components/JsonEditor";
import { parseWorkflowToGraph, getDefaultWorkflow } from "./utils/graphParser";
import type { WorkflowConfig } from "./types/workflow.types";
import "./App.css";

function App() {
  const [workflow, setWorkflow] = useState<WorkflowConfig>(
    getDefaultWorkflow()
  );
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(getDefaultWorkflow(), null, 2)
  );
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"graph" | "form">("graph");
  const stateKeys = Object.keys(workflow.Workflow?.States || {});
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  const currentState = stateKeys[currentStateIndex] || stateKeys[0] || "";

  const handleNodeFormView = (nodeId: string) => {
    const index = stateKeys.indexOf(nodeId);
    if (index !== -1) {
      setCurrentStateIndex(index);
      setViewMode("form");
    }
  };

  const handleBackToGraph = () => {
    setViewMode("graph");
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setWorkflow(parsed);
      setError(null);
    } catch {
      setError("Failed to parse JSON. Please check the format.");
    }
  };

  const { nodes, edges } = parseWorkflowToGraph(workflow);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Workflow Visualizer</h1>
        <div className="header-controls">
          <button
            className="toggle-button"
            onClick={() => setViewMode(viewMode === "graph" ? "form" : "graph")}
          >
            {viewMode === "graph" ? "View Form" : "View Graph"}
          </button>
          <button
            className="toggle-button"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide" : "Show"} Editor
          </button>
        </div>
      </header>

      <div className="app-body">
        {viewMode === "form" ? (
          <div style={{ width: "100%" }}>
            <FormViewer
              stateName={currentState}
              state={workflow.Workflow?.States?.[currentState]}
              onSubmit={(data) => console.log("Submit:", data)}
              onReject={(data) => console.log("Reject:", data)}
              onBack={handleBackToGraph}
            />
          </div>
        ) : (
          <>
            {showEditor && (
              <div className="editor-panel">
                <JsonEditor
                  value={jsonText}
                  onChange={setJsonText}
                  onApply={handleApplyJson}
                  error={error}
                />
              </div>
            )}

            <div className="graph-panel">
              <WorkflowGraph
                nodes={nodes}
                edges={edges}
                onNodeFormView={handleNodeFormView}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
