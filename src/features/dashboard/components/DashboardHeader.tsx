// src/features/dashboard/components/DashboardHeader.tsx
import React from "react";
import { Filter, Search } from "lucide-react";

interface DashboardHeaderProps {
  searchTerm: string;
  myQueueOnly: boolean;
  onSearchChange: (term: string) => void;
  onMyQueueToggle: (checked: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm,
  myQueueOnly,
  onSearchChange,
  onMyQueueToggle,
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
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
          Applications Queue
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            style={{
              padding: "8px 16px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <Filter
              size={16}
              style={{ display: "inline", marginRight: "6px" }}
            />
            View
          </button>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>Admin</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 300px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={myQueueOnly}
            onChange={(e) => onMyQueueToggle(e.target.checked)}
          />
          <span style={{ fontSize: "14px" }}>My Queue</span>
        </label>

        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          <select
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option>All Status</option>
            <option>Disbursement</option>
            <option>Verification</option>
            <option>Underwriting</option>
            <option>Decision</option>
          </select>
          <select
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option>All Stages</option>
            <option>Initial Review</option>
            <option>Documentation</option>
            <option>Final Approval</option>
          </select>
          <select
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option>All Products</option>
            <option>Personal Loan</option>
            <option>Auto Loan</option>
            <option>Mortgage</option>
            <option>Business Loan</option>
          </select>
          <select
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option>All Owners</option>
            <option>Jane Doe</option>
            <option>Bob Wilson</option>
            <option>Sarah Lee</option>
          </select>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              background: "white",
            }}
          >
            Date Range
          </button>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              background: "white",
            }}
          >
            Amount Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
