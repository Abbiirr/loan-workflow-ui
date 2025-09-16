// src/features/application-details/components/WorkflowProgress.tsx
import React from "react";

export interface WorkflowStage {
  name: string;
  status: "completed" | "current";
}

const WorkflowProgress: React.FC<{ workflowStages: WorkflowStage[] }> = ({
  workflowStages,
}) => {
  return (
    <div
      style={{
        padding: "16px 24px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {workflowStages.map((s) => (
          <span
            key={s.name}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: s.status === "current" ? "#dbeafe" : "#f3f4f6",
              color: "#111827",
              fontSize: 12,
              boxShadow:
                s.status === "current" ? "0 0 0 1px #93c5fd inset" : undefined,
            }}
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;
