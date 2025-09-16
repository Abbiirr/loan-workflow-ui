// src/features/application-details/components/ApplicationHeader.tsx
import React from "react";
import type { LoanApplication } from "@features/dashboard/types/dashboard.types";
import { Phone, Settings, User, ChevronLeft } from "lucide-react";
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
            gap: 6,
            padding: "6px 10px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            background: "white",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={16} /> Back
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

        <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
          {application.stage === "Disbursement" ? (
            <button
              style={{
                padding: "8px 12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
              title="Disburse"
            >
              Disburse
            </button>
          ) : null}
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
          <button
            style={{
              padding: 8,
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
            }}
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            style={{
              padding: 8,
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 9999,
              cursor: "pointer",
            }}
            title={application.assignee}
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
