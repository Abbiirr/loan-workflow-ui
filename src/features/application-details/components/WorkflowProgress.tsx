// src/features/application-details/components/WorkflowProgress.tsx
import React from "react";
import { Check } from "lucide-react";

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
        background: "white",
        padding: "20px 24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "40px",
            right: "40px",
            height: "2px",
            background: "#e5e7eb",
            zIndex: 0,
          }}
        />
        {workflowStages.map((stage, idx) => (
          <div
            key={stage.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: stage.status === "current" ? "#3b82f6" : "#10b981",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              {stage.status === "current" ? idx + 1 : <Check size={20} />}
            </div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {stage.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;
