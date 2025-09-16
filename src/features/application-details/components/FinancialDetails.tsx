// src/features/application-details/components/FinancialDetails.tsx
import React from "react";

const FinancialDetails: React.FC<{ amount: number }> = ({ amount }) => (
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginTop: 0 }}>Financial Details</h3>
    <div>Amount: ${amount.toLocaleString()}</div>
    <div>Estimated EMI: ${(amount * 0.02).toFixed(2)}</div>
  </div>
);

export default FinancialDetails;
