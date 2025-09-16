// src/features/application-details/components/ApplicationHeader.tsx
import React from "react";
import type { LoanApplication } from "@features/dashboard/types/dashboard.types";
import { Phone, Settings, User, ArrowLeft } from "lucide-react";
import { getStageColor } from "@shared/utils/colors";

interface ApplicationHeaderProps {
  application: LoanApplication;
  onBack: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  onBack,
}) => {
  return (
    <div style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          {application.applicant}
        </h2>

        <span
          style={{
            marginLeft: 8,
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 12,
            background: getStageColor(application.stage),
            color: "white",
          }}
        >
          {application.stage}
        </span>

        <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 14 }}>
          {application.product} • ${application.amount.toLocaleString()}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginLeft: 16,
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "8px 20px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
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
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Disburse
          </button>
          <button
            style={{
              padding: "8px 12px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Call Applicant"
          >
            <Phone size={16} /> Call
          </button>
          <Settings
            size={20}
            color="#6b7280"
            style={{ cursor: "pointer", marginLeft: 8 }}
          />
          <User size={20} color="#6b7280" />
          <span style={{ fontSize: 14, color: "#6b7280" }}>Admin</span>
        </div>
      </div>
    </div>
  );
};
