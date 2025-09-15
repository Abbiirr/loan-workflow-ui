import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import ApplicationTable from "./ApplicationTable";
import ResultsCount from "./ResultsCount";
import type { LoanApplication } from "./Dashboard.types";

type DashboardProps = {
  // Preferred prop used by App to show ApplicationDetails
  onApplicationClick?: (app: LoanApplication) => void;
  // Backward compatibility: keep old prop name working
  onRowClick?: (app: LoanApplication) => void;
};

const Dashboard: React.FC<DashboardProps> = ({
  onApplicationClick,
  onRowClick,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [myQueueOnly, setMyQueueOnly] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Seed data
  const applications: LoanApplication[] = [
    {
      id: "LN-2024-001",
      applicant: "Sarah Johnson",
      product: "Personal Loan",
      amount: 25000,
      stage: "Disbursement",
      assignee: "Jane Doe",
      sla: "Due in 24h",
      slaStatus: "ontime",
      lastUpdate: "1/15/2024",
      flags: [],
      docs: 3,
    },
    {
      id: "LN-2024-002",
      applicant: "Michael Chen",
      product: "Auto Loan",
      amount: 32000,
      stage: "Verification",
      assignee: "Bob Wilson",
      sla: "Due in 22h",
      slaStatus: "ontime",
      lastUpdate: "1/18/2024",
      flags: ["warning"],
      docs: 2,
    },
    {
      id: "LN-2024-003",
      applicant: "Emma Rodriguez",
      product: "Mortgage",
      amount: 450000,
      stage: "Underwriting",
      assignee: "Sarah Lee",
      sla: "Due in 24h",
      slaStatus: "ontime",
      lastUpdate: "1/20/2024",
      flags: ["alert"],
      docs: 4,
    },
    {
      id: "LN-2024-004",
      applicant: "David Wilson",
      product: "Business Loan",
      amount: 75000,
      stage: "Decision",
      assignee: "Tom Anderson",
      sla: "Overdue 96h",
      slaStatus: "overdue",
      lastUpdate: "1/12/2024",
      flags: ["alert", "locked"],
      docs: 2,
    },
    {
      id: "LN-2024-005",
      applicant: "Lisa Thompson",
      product: "Personal Loan",
      amount: 15000,
      stage: "Disbursement",
      assignee: "Mike Johnson",
      sla: "Due in 24h",
      slaStatus: "ontime",
      lastUpdate: "1/22/2024",
      flags: [],
      docs: 2,
    },
    {
      id: "LN-2024-006",
      applicant: "James Anderson",
      product: "Home Equity",
      amount: 120000,
      stage: "RMReview",
      assignee: "Emily Brown",
      sla: "Due in 48h",
      slaStatus: "ontime",
      lastUpdate: "1/23/2024",
      flags: [],
      docs: 5,
    },
    {
      id: "LN-2024-007",
      applicant: "Maria Garcia",
      product: "Student Loan",
      amount: 45000,
      stage: "CMReview",
      assignee: "Alex Kumar",
      sla: "Due in 12h",
      slaStatus: "due",
      lastUpdate: "1/24/2024",
      flags: ["warning"],
      docs: 3,
    },
    {
      id: "LN-2024-008",
      applicant: "Robert Kim",
      product: "Auto Loan",
      amount: 28000,
      stage: "BusinessReview",
      assignee: "Jane Doe",
      sla: "Due in 36h",
      slaStatus: "ontime",
      lastUpdate: "1/24/2024",
      flags: [],
      docs: 2,
    },
  ];

  const filteredApplications = applications.filter(
    (app) =>
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Disbursement: "#3b82f6",
      Verification: "#f59e0b",
      Underwriting: "#8b5cf6",
      Decision: "#ef4444",
      RMReview: "#06b6d4",
      CMReview: "#ec4899",
      BusinessReview: "#10b981",
      ARMDraft: "#6366f1",
    };
    return colors[stage] || "#6b7280";
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredApplications.map((app) => app.id) : []);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleRowClick = (app: LoanApplication) => {
    setActiveRowId(app.id);
    if (onApplicationClick) {
      onApplicationClick(app);
    } else if (onRowClick) {
      onRowClick(app);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DashboardHeader
        searchTerm={searchTerm}
        myQueueOnly={myQueueOnly}
        onSearchChange={setSearchTerm}
        onMyQueueToggle={setMyQueueOnly}
      />

      <ResultsCount
        filteredCount={filteredApplications.length}
        totalCount={applications.length}
      />

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}>
        <ApplicationTable
          applications={filteredApplications}
          selectedRows={selectedRows}
          activeRowId={activeRowId}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onRowClick={handleRowClick}
          getStageColor={getStageColor}
        />
      </div>
    </div>
  );
};

export default Dashboard;
