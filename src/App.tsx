import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import WorkflowGraph from "./components/WorkflowGraph";
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
    <ReactFlowProvider>
      <div className="app">
        <header className="app-header">
          <h1>Workflow Visualizer</h1>
          <div className="header-controls">
            <button
              className="toggle-button"
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? "Hide" : "Show"} Editor
            </button>
          </div>
        </header>

        <div className="app-body">
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
            <WorkflowGraph nodes={nodes} edges={edges} />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
