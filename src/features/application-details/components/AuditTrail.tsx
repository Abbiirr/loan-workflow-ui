// src/features/application-details/components/AuditTrail.tsx
import React, { useState } from "react";
import { Download, MessageSquare } from "lucide-react";

interface AuditEntry {
  user: string;
  action: "action" | "system";
  message: string;
  time: string;
}

const AuditTrail: React.FC<{ auditTrail: AuditEntry[] }> = ({ auditTrail }) => {
  const [comment, setComment] = useState("");

  const handleExport = () => {
    const content = auditTrail
      .map((a) => `[${a.time}] ${a.user}: ${a.message}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-trail.txt";
    a.click();
  };

  const handleAdd = () => {
    if (!comment.trim()) return;
    // In a real app, post to API; here we just clear input
    setComment("");
  };

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0, flex: 1 }}>Audit Trail</h3>
        <button
          onClick={handleExport}
          title="Export"
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
      </div>
      <ul style={{ paddingLeft: 16, marginBottom: 12 }}>
        {auditTrail.map((a, i) => (
          <li key={`${a.user}-${i}`}>
            [{a.time}] {a.user}: {a.message}
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <MessageSquare
            size={16}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "#6b7280",
            }}
          />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          />
        </div>
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 12px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AuditTrail;
