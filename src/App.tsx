import { useState } from "react";
import GraphView from "./GraphView";
import ApplicationsPage from "./ApplicationsPage";
import { ReactFlowProvider } from "@xyflow/react";

export default function App() {
  const [tab, setTab] = useState<"workflow" | "apps">("apps");

  return (
    <div
      style={{ height: "100vh", display: "grid", gridTemplateRows: "48px 1fr" }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid #e6ebf2",
          background: "#fff",
        }}
      >
        <button
          onClick={() => setTab("apps")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #e6ebf2",
            background: tab === "apps" ? "#eef2ff" : "#fff",
          }}
        >
          Applications
        </button>
        <button
          onClick={() => setTab("workflow")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #e6ebf2",
            background: tab === "workflow" ? "#eef2ff" : "#fff",
          }}
        >
          Workflow Viewer
        </button>
      </div>
      <div style={{ minHeight: 0 }}>
        {tab === "apps" ? (
          <ApplicationsPage />
        ) : (
          <ReactFlowProvider>
            <GraphView />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
