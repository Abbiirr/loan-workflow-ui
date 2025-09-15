import { useState } from "react";
import WorkflowGraph from "./components/WorkflowGraph";
import FormViewer from "./components/FormViewer";
import JsonEditor from "./components/JsonEditor";
import Dashboard from "./components/Dashboard";
import ApplicationDetails from "./components/ApplicationDetails";
import { parseWorkflowToGraph, getDefaultWorkflow } from "./utils/graphParser";
import type { WorkflowConfig } from "./types/workflow.types";
import type { LoanApplication } from "./components/Dashboard";
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
  const [viewMode, setViewMode] = useState<
    "dashboard" | "graph" | "form" | "details"
  >("dashboard");
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplication | null>(null);
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

  const handleApplicationClick = (application: LoanApplication) => {
    setSelectedApplication(application);
    setViewMode("details");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setSelectedApplication(null);
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

  // Application Details view
  if (viewMode === "details" && selectedApplication) {
    return (
      <ApplicationDetails
        application={selectedApplication}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Dashboard view - no editor panel
  if (viewMode === "dashboard") {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Workflow Manager</h1>
          <div className="header-controls">
            <button
              className="toggle-button"
              onClick={() => setViewMode("graph")}
              style={{
                background: "#10b981",
                borderRadius: "6px",
                padding: "8px 20px",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Workflow Editor
            </button>
          </div>
        </header>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Dashboard onApplicationClick={handleApplicationClick} />
        </div>
      </div>
    );
  }

  // Graph/Form view
  return (
    <div className="app">
      <header className="app-header">
        <h1>Workflow Visualizer</h1>
        <div className="header-controls">
          <button
            className="toggle-button"
            onClick={() => setViewMode("dashboard")}
            style={{
              background: "#6366f1",
              marginRight: "12px",
            }}
          >
            Dashboard
          </button>
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
