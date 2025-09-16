// src/features/dashboard/components/ApplicationTable.tsx
import React from "react";
import type { LoanApplication } from "@features/dashboard/types/dashboard.types";
import ApplicationRow from "./ApplicationRow";

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
          style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}
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
          {[
            "Applicant ↕",
            "Product ↕",
            "Amount ↕",
            "Stage ↕",
            "Assignee ↕",
            "SLA/Age",
            "Docs",
            "Last Update ↕",
            "Flags",
            "Action",
          ].map((h) => (
            <th
              key={h}
              style={{
                padding: "12px",
                textAlign: h === "Action" ? "center" : "left",
                fontSize: "12px",
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              {h}
            </th>
          ))}
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
