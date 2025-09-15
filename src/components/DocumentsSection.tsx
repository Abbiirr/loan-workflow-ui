import React from "react";
import { Upload, Check, Eye } from "lucide-react";

interface Document {
  name: string;
  filename: string;
  status: "complete" | "review" | "pending";
  required: boolean;
}

interface DocumentsSectionProps {
  documents: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  return (
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
          <div style={{ width: "50%", height: "100%", background: "#3b82f6" }} />
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
  );
};

export default DocumentsSection;