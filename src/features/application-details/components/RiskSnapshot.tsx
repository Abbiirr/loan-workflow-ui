// src/features/application-details/components/RiskSnapshot.tsx
import React from "react";

const RiskSnapshot: React.FC = () => (
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginTop: 0 }}>Risk Snapshot</h3>
    <div>Risk Score: 720</div>
    <div>Debt-to-Income: 28%</div>
  </div>
);

export default RiskSnapshot;
