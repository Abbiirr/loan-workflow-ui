// src/features/dashboard/components/DashboardHeader.tsx
import React from "react";
import { Filter, Search } from "lucide-react";
import "./DashboardHeader.css";

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
    <div className="dashboard-header">
      <div className="dashboard-header-top">
        <h2 className="dashboard-title">Applications Queue</h2>
        <div className="dashboard-actions">
          <button className="dh-view-btn">
            <Filter
              size={16}
              style={{ display: "inline", marginRight: "6px" }}
            />
            View
          </button>
          <div className="dh-admin">Admin</div>
        </div>
      </div>

      <div className="dh-search-row">
        <div className="dh-search-wrapper">
          <Search size={16} className="dh-search-icon" />
          <input
            className="dh-search-input"
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <label className="dh-toggle">
          <input
            type="checkbox"
            checked={myQueueOnly}
            onChange={(e) => onMyQueueToggle(e.target.checked)}
          />
          <span style={{ fontSize: "14px" }}>My Queue</span>
        </label>

        <div className="dh-filters">
          <select className="dh-select">
            <option>All Status</option>
            <option>Disbursement</option>
            <option>Verification</option>
            <option>Underwriting</option>
            <option>Decision</option>
          </select>
          <select className="dh-select">
            <option>All Stages</option>
            <option>Initial Review</option>
            <option>Documentation</option>
            <option>Final Approval</option>
          </select>
          <select className="dh-select">
            <option>All Products</option>
            <option>Personal Loan</option>
            <option>Auto Loan</option>
            <option>Mortgage</option>
            <option>Business Loan</option>
          </select>
          <select className="dh-select">
            <option>All Owners</option>
            <option>Jane Doe</option>
            <option>Bob Wilson</option>
            <option>Sarah Lee</option>
          </select>
          <button className="dh-btn">Date Range</button>
          <button className="dh-btn">Amount Range</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
