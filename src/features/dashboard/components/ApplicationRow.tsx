// src/features/dashboard/components/ApplicationRow.tsx
import React from "react";
import { AlertTriangle, Lock, MoreHorizontal } from "lucide-react";
import type { LoanApplication } from "@features/dashboard/types/dashboard.types";

type Props = {
  app: LoanApplication;
  isActive: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: (app: LoanApplication) => void;
  getStageColor: (stage: string) => string;
};

const ApplicationRow: React.FC<Props> = ({
  app,
  isActive,
  selected,
  onSelect,
  onClick,
  getStageColor,
}) => {
  return (
    <tr
      key={app.id}
      style={{
        borderBottom: "1px solid #f3f4f6",
        cursor: "pointer",
        background: isActive ? "#eef2ff" : "transparent",
      }}
      onClick={() => onClick(app)}
    >
      <td style={{ padding: "12px" }}>
        <input
          type="checkbox"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onSelect(app.id)}
        />
      </td>
      <td style={{ padding: "12px", fontSize: "14px", fontWeight: 500 }}>
        {app.applicant}
      </td>
      <td style={{ padding: "12px", fontSize: "14px" }}>{app.product}</td>
      <td style={{ padding: "12px", fontSize: "14px", fontWeight: 500 }}>
        ${app.amount.toLocaleString()}
      </td>
      <td style={{ padding: "12px" }}>
        <span
          style={{
            padding: "4px 10px",
            background: getStageColor(app.stage),
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {app.stage}
        </span>
      </td>
      <td style={{ padding: "12px", fontSize: "14px" }}>{app.assignee}</td>
      <td style={{ padding: "12px", fontSize: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              color: app.slaStatus === "overdue" ? "#ef4444" : "#6b7280",
            }}
          >
            {app.sla}
          </span>
          {(() => {
            let bg = "#dcfce7";
            let fg = "#166534";
            if (app.slaStatus === "overdue") {
              bg = "#fee2e2";
              fg = "#991b1b";
            } else if (app.slaStatus === "due") {
              bg = "#fef3c7";
              fg = "#92400e";
            }
            return (
              <span
                style={{
                  padding: "2px 6px",
                  background: bg,
                  color: fg,
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                {`${app.docs || 0}/${app.docs ? app.docs + 2 : 5}`}
              </span>
            );
          })()}
        </div>
      </td>
      <td style={{ padding: "12px", fontSize: "14px", color: "#6b7280" }}>
        {app.docs || 0}
      </td>
      <td style={{ padding: "12px", fontSize: "14px", color: "#6b7280" }}>
        {app.lastUpdate}
      </td>
      <td style={{ padding: "12px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {app.flags.includes("alert") && (
            <AlertTriangle size={16} color="#f59e0b" />
          )}
          {app.flags.includes("locked") && <Lock size={16} color="#6b7280" />}
        </div>
      </td>
      <td style={{ padding: "12px", textAlign: "center" }}>
        {app.stage === "Disbursement" ? (
          <button
            style={{
              padding: "6px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Disburse
          </button>
        ) : (
          <button
            style={{
              padding: "4px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={16} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default ApplicationRow;
