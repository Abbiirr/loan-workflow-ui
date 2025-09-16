// src/components/graph/GraphToolbar.tsx
import React from "react";
import { Download } from "lucide-react";

type GraphToolbarProps = {
  onExport?: () => void;
  right?: React.ReactNode;
};

const GraphToolbar: React.FC<GraphToolbarProps> = ({ onExport, right }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {onExport && (
        <button
          onClick={onExport}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 10px",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          <Download size={14} />
          Export
        </button>
      )}
      {right}
    </div>
  );
};

export default GraphToolbar;
