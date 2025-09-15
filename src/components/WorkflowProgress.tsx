
import React from "react";
import { Check } from "lucide-react";

interface WorkflowStage {
  name: string;
  status: "completed" | "current";
}

interface WorkflowProgressProps {
  workflowStages: WorkflowStage[];
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
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
            key={idx}
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
                background:
                  stage.status === "current" ? "#3b82f6" : "#10b981",
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

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          Next Actions:
        </span>
        <button
          style={{
            padding: "6px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Approve
        </button>
        <button
          style={{
            padding: "6px 16px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Request More Info
        </button>
        <button
          style={{
            padding: "6px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default WorkflowProgress;