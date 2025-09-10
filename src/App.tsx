import { useState } from "react";
import GraphView from "./GraphView";
import ApplicationsPage from "./ApplicationsPage";
import WorkflowMaker from "./WorkflowMaker"; // <- if you added the maker page

export default function App() {
  const [tab, setTab] = useState<"apps" | "workflow" | "maker">("apps");

  return (
    <div
      style={{ height: "100vh", display: "grid", gridTemplateRows: "48px 1fr" }}
    >
      <div
        role="tablist"
        aria-label="Main sections"
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
          role="tab"
          aria-selected={tab === "apps"}
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
          role="tab"
          aria-selected={tab === "workflow"}
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
        <button
          role="tab"
          aria-selected={tab === "maker"}
          onClick={() => setTab("maker")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #e6ebf2",
            background: tab === "maker" ? "#eef2ff" : "#fff",
          }}
        >
          Configure
        </button>
      </div>

      <div style={{ minHeight: 0 }}>
        {tab === "apps" ? (
          <ApplicationsPage />
        ) : tab === "workflow" ? (
          <GraphView />
        ) : (
          <WorkflowMaker />
        )}
      </div>
    </div>
  );
}
