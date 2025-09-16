// src/features/application-details/components/DocumentsSection.tsx
import React from "react";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";

interface AppDocument {
  name: string;
  filename: string;
  status: "complete" | "review" | "pending";
  required: boolean;
}

const badge = (status: AppDocument["status"]) => {
  if (status === "complete")
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "2px 8px",
          borderRadius: 999,
          background: "#dcfce7",
          color: "#166534",
          fontSize: 12,
        }}
      >
        <CheckCircle2 size={14} /> Complete
      </span>
    );
  if (status === "review")
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "2px 8px",
          borderRadius: 999,
          background: "#fef3c7",
          color: "#92400e",
          fontSize: 12,
        }}
      >
        <AlertCircle size={14} /> Review
      </span>
    );
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        borderRadius: 999,
        background: "#e5e7eb",
        color: "#374151",
        fontSize: 12,
      }}
    >
      Pending
    </span>
  );
};

const DocumentsSection: React.FC<{ documents: AppDocument[] }> = ({
  documents,
}) => (
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginTop: 0 }}>Documents</h3>
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8 }}
    >
      {documents.map((d) => (
        <React.Fragment key={d.name}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong>{d.name}</strong>
            {d.required && (
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontSize: 10,
                }}
              >
                Required
              </span>
            )}
            <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>
              {d.filename || "missing"}
            </span>
          </div>
          <div>{badge(d.status)}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              title="Download"
              style={{
                padding: 6,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
              }}
            >
              <Download size={16} />
            </button>
            <button
              title="Upload"
              style={{
                padding: 6,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
              }}
            >
              <Upload size={16} />
            </button>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default DocumentsSection;
