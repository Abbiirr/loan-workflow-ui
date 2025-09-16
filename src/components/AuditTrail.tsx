// src/components/AuditTrail.tsx
import React, { useState } from "react";
import { Download, User } from "lucide-react";

interface AuditEntry {
  user: string;
  action: "action" | "system";
  message: string;
  time: string;
}

interface AuditTrailProps {
  auditTrail: AuditEntry[];
}

const AuditTrail: React.FC<AuditTrailProps> = ({ auditTrail }) => {
  const [activeComment, setActiveComment] = useState("");

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
                  background: entry.action === "system" ? "#f3f4f6" : "#e0e7ff",
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
  );
};

export default AuditTrail;
