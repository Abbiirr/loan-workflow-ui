// src/components/ApplicationTable.tsx
import React from "react";
import type { LoanApplication } from "./Dashboard.types";
import ApplicationRow from "./table/ApplicationRow";

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
        {applications.map((app) => (
          <ApplicationRow
            key={app.id}
            app={app}
            isActive={activeRowId === app.id}
            selected={selectedRows.includes(app.id)}
            onSelect={onSelectRow}
            onClick={onRowClick}
            getStageColor={getStageColor}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ApplicationTable;
