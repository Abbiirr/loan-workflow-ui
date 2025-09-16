// src/features/workflow/components/StateNode.tsx
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Hash,
  Type,
  List,
} from "lucide-react";
import type { Field } from "@features/workflow/types/workflow.types";

export const StateNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false);

  const getFieldIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "number":
        return <Hash size={12} />;
      case "select":
        return <List size={12} />;
      default:
        return <Type size={12} />;
    }
  };

  return (
    <div
      style={{
        background: selected ? "#e0e7ff" : "white",
        border: `2px solid ${selected ? "#4f46e5" : "#e5e7eb"}`,
        borderRadius: "8px",
        padding: "12px",
        minWidth: "200px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#4f46e5" }}
      />

      <div
        style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
      >
        {data.label}
      </div>

      {data.hasForm && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <FileText size={14} />
            <span>{data.fields?.length || 0} fields</span>
          </button>

          {expanded && data.fields && (
            <div
              style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px solid #e5e7eb",
                fontSize: "11px",
              }}
            >
              {data.fields.map((field: Field) => (
                <div
                  key={field.ID || field.Name}
                  style={{
                    marginBottom: "6px",
                    padding: "4px",
                    background: "#f9fafb",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {getFieldIcon(field.Type)}
                  <div>
                    <div style={{ fontWeight: "500", color: "#374151" }}>
                      {field.Name || field.ID}
                    </div>
                    {field.FieldActions && field.FieldActions.length > 0 && (
                      <div style={{ color: "#9ca3af", fontSize: "10px" }}>
                        Actions:{" "}
                        {field.FieldActions.map(
                          (action) => action.Operation
                        ).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!data.hasForm && (
        <div
          style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}
        >
          No form configured
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#4f46e5" }}
      />
    </div>
  );
};

export default StateNode;
