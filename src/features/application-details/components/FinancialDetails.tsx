// src/features/application-details/components/FinancialDetails.tsx
import React from "react";

const FinancialDetails: React.FC<{ amount: number }> = ({ amount }) => (
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
      💵 Financial Details
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Amount
        </div>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>
          ${amount.toLocaleString()}
        </div>
      </div>
      <div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Estimated EMI
        </div>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>
          ${(amount * 0.02).toFixed(2)}
        </div>
      </div>
    </div>
  </div>
);

export default FinancialDetails;
