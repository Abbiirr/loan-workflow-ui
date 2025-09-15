import React from "react";
import { MoreHorizontal, AlertTriangle, Lock } from "lucide-react";
import type { LoanApplication } from "./Dashboard.types";

interface ApplicationTableProps {
  applications: LoanApplication[];
  selectedRows: string[];
  activeRowId: string | null;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string) => void;
  onRowClick: (app: LoanApplication) => void;
  getStageColor: (stage: string) => string;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  selectedRows,
  activeRowId,
  onSelectAll,
  onSelectRow,
  onRowClick,
  getStageColor,
}) => {
  return (
    <table
      style={{
        width: "100%",
        background: "white",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <thead>
        <tr
          style={{
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <th style={{ padding: "12px", textAlign: "left", width: "40px" }}>
            <input
              type="checkbox"
              onChange={(e) => onSelectAll(e.target.checked)}
              checked={
                selectedRows.length === applications.length &&
                applications.length > 0
              }
            />
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Applicant ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Product ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Amount ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Stage ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Assignee ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            SLA/Age
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Docs
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Last Update ↕
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Flags
          </th>
          <th
            style={{
              padding: "12px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => {
          const isActive = activeRowId === app.id;
          return (
            <tr
              key={app.id}
              style={{
                borderBottom: "1px solid #f3f4f6",
                cursor: "pointer",
                transition: "background 0.2s",
                background: isActive ? "#eef2ff" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive
                  ? "#eef2ff"
                  : "transparent";
              }}
              onClick={() => onRowClick(app)}
            >
              <td style={{ padding: "12px" }}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(app.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onSelectRow(app.id)}
                />
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {app.applicant}
              </td>
              <td style={{ padding: "12px", fontSize: "14px" }}>
                {app.product}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
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
                    fontWeight: "500",
                  }}
                >
                  {app.stage}
                </span>
              </td>
              <td style={{ padding: "12px", fontSize: "14px" }}>
                {app.assignee}
              </td>
              <td style={{ padding: "12px", fontSize: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color:
                        app.slaStatus === "overdue" ? "#ef4444" : "#6b7280",
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
                          fontWeight: "500",
                        }}
                      >
                        {`${app.docs || 0}/${app.docs ? app.docs + 2 : 5}`}
                      </span>
                    );
                  })()}
                </div>
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {app.docs || 0}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {app.lastUpdate}
              </td>
              <td style={{ padding: "12px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {app.flags.includes("alert") && (
                    <AlertTriangle size={16} color="#f59e0b" />
                  )}
                  {app.flags.includes("locked") && (
                    <Lock size={16} color="#6b7280" />
                  )}
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
        })}
      </tbody>
    </table>
  );
};

export default ApplicationTable;
