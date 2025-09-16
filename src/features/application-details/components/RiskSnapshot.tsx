// src/features/application-details/components/RiskSnapshot.tsx
import React from "react";

const RiskSnapshot: React.FC = () => (
  <div
    style={{
      background: "white",
      borderRadius: "8px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      height: "100%",
    }}
  >
    <h3
      style={{
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "16px",
      }}
    >
      ⚠️ Risk Snapshot
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Risk Score</span>
          <span
            style={{
              padding: "2px 8px",
              background: "#dbeafe",
              color: "#1e40af",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Low
          </span>
        </div>
        <div
          style={{
            background: "#e5e7eb",
            height: "8px",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "20%",
              height: "100%",
              background: "#3b82f6",
            }}
          />
        </div>
      </div>
      <div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Risk Score
        </div>
        <div style={{ fontSize: "24px", fontWeight: "600", color: "#f59e0b" }}>
          720
        </div>
      </div>
      <div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Debt-to-Income
        </div>
        <div style={{ fontSize: "24px", fontWeight: "600", color: "#10b981" }}>
          28%
        </div>
      </div>
    </div>
  </div>
);

export default RiskSnapshot;
