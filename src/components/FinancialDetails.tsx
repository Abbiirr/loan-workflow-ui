
import React from "react";

interface FinancialDetailsProps {
  amount: number;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({ amount }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "8px",
        padding: "20px",
        border: "1px solid #e5e7eb",
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
      <div
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "4px",
            }}
          >
            Annual Income
          </div>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>
            ${(amount * 3.4).toLocaleString()}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "4px",
            }}
          >
            Credit Score
          </div>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>742</div>
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "4px",
            }}
          >
            Employment
          </div>
          <div style={{ fontSize: "14px" }}>Full-time Employee</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDetails;