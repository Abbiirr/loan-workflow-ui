// src/components/ApplicationHeader.tsx
import React from "react";
import { ArrowLeft, Phone, Settings, User } from "lucide-react";

interface Application {
  applicant: string;
  product: string;
  amount: number;
  // Add other properties as needed
}

interface ApplicationHeaderProps {
  application: Application;
  onBack: () => void;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  onBack,
}) => {
  return (
    <div
      style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Settings size={20} color="#6b7280" style={{ cursor: "pointer" }} />
          <User size={20} color="#6b7280" />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>Admin</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 4px 0",
            }}
          >
            {application.applicant}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {application.product}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{ fontSize: "28px", fontWeight: "600", color: "#2563eb" }}
          >
            ${application.amount.toLocaleString()}.00
          </span>
          <button
            style={{
              padding: "8px 20px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Disbursement
          </button>
          <button
            style={{
              padding: "8px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Disburse
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Phone size={16} />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export { ApplicationHeader };
