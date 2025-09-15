import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Settings,
  Upload,
  Download,
  Eye,
  Check,
  X,
  MessageSquare,
  User,
} from "lucide-react";

interface ApplicationDetailsProps {
  application: any;
  onBack: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  onBack,
}) => {
  const [activeComment, setActiveComment] = useState("");

  const workflowStages = [
    { name: "Application", status: "completed" },
    { name: "Verification", status: "completed" },
    { name: "Underwriting", status: "completed" },
    { name: "Decision", status: "completed" },
    { name: "Disbursement", status: "current" },
  ];

  const documents = [
    {
      name: "Identity Verification",
      filename: "id_verification.pdf",
      status: "complete",
      required: true,
    },
    {
      name: "Income Proof",
      filename: "pay_stub_jan2024.pdf",
      status: "complete",
      required: true,
    },
    {
      name: "Bank Statements",
      filename: "bank_statement.pdf",
      status: "review",
      required: true,
    },
    { name: "Credit Report", filename: "", status: "pending", required: true },
    {
      name: "Employment Letter",
      filename: "",
      status: "pending",
      required: false,
    },
  ];

  const auditTrail = [
    {
      user: "Jane Doe",
      action: "action",
      message: "Application approved for full amount",
      time: "1/15/2024, 3:15:00 PM",
    },
    {
      user: "Jane Doe",
      action: "action",
      message: "Application assigned for review",
      time: "1/15/2024, 2:30:00 PM",
    },
    {
      user: "System",
      action: "system",
      message: "Application submitted",
      time: "1/15/2024, 6:00:00 AM",
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Settings size={20} color="#6b7280" style={{ cursor: "pointer" }} />
            <User size={20} color="#6b7280" />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Admin</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                margin: "0 0 4px 0",
              }}
            >
              {application.applicant}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              {application.product}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{ fontSize: "28px", fontWeight: "600", color: "#2563eb" }}
            >
              ${application.amount.toLocaleString()}.00
            </span>
            <button
              style={{
                padding: "8px 20px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
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
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Disburse
            </button>
            <button
              style={{
                padding: "8px 16px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Phone size={16} />
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          background: "white",
          padding: "20px 24px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "40px",
              right: "40px",
              height: "2px",
              background: "#e5e7eb",
              zIndex: 0,
            }}
          />
          {workflowStages.map((stage, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    stage.status === "current" ? "#3b82f6" : "#10b981",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                }}
              >
                {stage.status === "current" ? idx + 1 : <Check size={20} />}
              </div>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Next Actions:
          </span>
          <button
            style={{
              padding: "6px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
          <button
            style={{
              padding: "6px 16px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Request More Info
          </button>
          <button
            style={{
              padding: "6px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Contact Information */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Phone size={18} />
            Contact Information
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              ✉️ {application.applicant.toLowerCase().replace(" ", ".")}
              @email.com
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              📞 (555) 123-4567
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              📍 123 Main St, Chicago, IL 60601
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            💵 Financial Details
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Annual Income
              </div>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>
                ${(application.amount * 3.4).toLocaleString()}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Credit Score
              </div>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>742</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Employment
              </div>
              <div style={{ fontSize: "14px" }}>Full-time Employee</div>
            </div>
          </div>
        </div>

        {/* Risk & Credit Snapshot */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            ⚠️ Risk & Credit Snapshot
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  Risk Score
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Low
                </span>
              </div>
              <div
                style={{
                  background: "#e5e7eb",
                  height: "8px",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "20%",
                    height: "100%",
                    background: "#3b82f6",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Credit Score
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#f59e0b",
                }}
              >
                742
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Debt-to-Income
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#10b981",
                }}
              >
                28%
              </div>
            </div>
            <button
              style={{
                width: "100%",
                padding: "8px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              View Full Underwriting Report
            </button>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div
        style={{
          padding: "0 24px 24px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb",
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
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
              📄 Documents (2/4)
            </h3>
            <button
              style={{
                padding: "6px 12px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Upload size={14} />
              Upload
            </button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                background: "#e5e7eb",
                height: "8px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{ width: "50%", height: "100%", background: "#3b82f6" }}
              />
            </div>
            <span
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              50% complete
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        doc.status === "complete"
                          ? "#dcfce7"
                          : doc.status === "review"
                          ? "#fef3c7"
                          : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {doc.status === "complete" ? (
                      <Check size={16} color="#166534" />
                    ) : doc.status === "review" ? (
                      <Eye size={16} color="#92400e" />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        ○
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                      {doc.name}
                      {doc.required && (
                        <span style={{ color: "#ef4444", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </div>
                    {doc.filename && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {doc.filename}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {doc.status === "complete" && (
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      Complete
                    </span>
                  )}
                  {doc.status === "review" && (
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#f59e0b",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      In Review
                    </span>
                  )}
                  {doc.status === "pending" && (
                    <button
                      style={{
                        padding: "4px 8px",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb",
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
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
              📝 Audit Trail (3)
            </h3>
            <button
              style={{
                padding: "6px 12px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Download size={14} />
              Export
            </button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <textarea
              placeholder="Add a comment..."
              value={activeComment}
              onChange={(e) => setActiveComment(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "none",
                minHeight: "80px",
              }}
            />
            <button
              style={{
                padding: "6px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                marginTop: "8px",
                float: "right",
              }}
            >
              Add Comment
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              clear: "both",
              paddingTop: "12px",
            }}
          >
            {auditTrail.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                  paddingBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <User size={14} color="#6b7280" />
                  <span style={{ fontSize: "12px", fontWeight: "500" }}>
                    {entry.user}
                  </span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background:
                        entry.action === "system" ? "#f3f4f6" : "#e0e7ff",
                      borderRadius: "4px",
                      fontSize: "10px",
                      color: entry.action === "system" ? "#6b7280" : "#4338ca",
                    }}
                  >
                    {entry.action}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    marginLeft: "22px",
                    marginBottom: "4px",
                  }}
                >
                  {entry.message}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    marginLeft: "22px",
                  }}
                >
                  {entry.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
