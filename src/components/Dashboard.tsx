import React, { useState } from "react";
import {
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface LoanApplication {
  id: string;
  applicant: string;
  product: string;
  amount: number;
  stage: string;
  assignee: string;
  sla: string;
  slaStatus: "ontime" | "due" | "overdue";
  lastUpdate: string;
  flags: string[];
  docs?: number;
}

const Dashboard: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [myQueueOnly, setMyQueueOnly] = useState(false);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredApplications.map((app) => app.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
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
      {/* Header */}
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

        {/* Search and Filters */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onChange={(e) => setMyQueueOnly(e.target.checked)}
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

      {/* Results count */}
      <div style={{ padding: "12px 24px", fontSize: "14px", color: "#6b7280" }}>
        Showing {filteredApplications.length} of {applications.length}{" "}
        applications
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}>
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
                  onChange={handleSelectAll}
                  checked={
                    selectedRows.length === filteredApplications.length &&
                    filteredApplications.length > 0
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
            {filteredApplications.map((app) => (
              <tr
                key={app.id}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => onApplicationClick(app)}
              >
                <td style={{ padding: "12px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(app.id)}
                    onChange={() => handleSelectRow(app.id)}
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
                    <span
                      style={{
                        padding: "2px 6px",
                        background:
                          app.slaStatus === "overdue"
                            ? "#fee2e2"
                            : app.slaStatus === "due"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          app.slaStatus === "overdue"
                            ? "#991b1b"
                            : app.slaStatus === "due"
                            ? "#92400e"
                            : "#166534",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "500",
                      }}
                    >
                      {`${app.docs || 0}/${app.docs ? app.docs + 2 : 5}`}
                    </span>
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
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
