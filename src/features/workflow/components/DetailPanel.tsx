// src/features/workflow/components/DetailPanel.tsx
import React from "react";
import { X, ArrowRight, FileText, Settings, Eye } from "lucide-react";
import type { Node, Edge } from "reactflow";
import type { Field } from "@features/workflow/types/workflow.types";
import "./DetailPanel.css";

interface DetailPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onClose: () => void;
  onViewForm?: (nodeId: string) => void;
}

const getFieldActions = (f: Field): string[] => {
  if (Array.isArray(f.Actions)) {
    return f.Actions;
  }
  if (Array.isArray(f.FieldActions)) {
    return f.FieldActions.map((a) => a.Operation).filter(Boolean);
  }
  return [];
};

const splitOperations = (op?: string): string[] => {
  return typeof op === "string" ? op.split(",") : [];
};

type NodeData = { hasForm?: boolean; label?: string; fields?: Field[] };
type EdgeData = { operation?: string };

const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedNode,
  selectedEdge,
  onClose,
  onViewForm,
}) => {
  if (!selectedNode && !selectedEdge) return null;

  const nodeData: NodeData = (selectedNode?.data as NodeData) ?? {};
  const edgeData: EdgeData = (selectedEdge?.data as EdgeData) ?? {};
  const fields: Field[] = Array.isArray(nodeData.fields) ? nodeData.fields : [];

  const safeString = (v: unknown): string => {
    if (v == null) return "";
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      return String(v);
    }
    return "";
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h3 className="detail-panel-title">
          {selectedNode ? "State Details" : "Action Details"}
        </h3>
        <button
          onClick={onClose}
          className="detail-panel-close"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      <div className="detail-panel-body">
        {selectedNode ? (
          <section aria-label="State details">
            {nodeData.hasForm ? (
              <button
                onClick={() =>
                  onViewForm ? onViewForm(selectedNode.id) : undefined
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "16px",
                  background: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                <Eye size={16} />
                Form View
              </button>
            ) : null}

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                State Name
              </div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>
                {safeString(nodeData.label)}
              </div>
            </div>

            {nodeData.hasForm ? (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FileText size={12} />
                  <span>Form Fields ({fields.length})</span>
                </div>

                <div style={{ display: "block" }}>
                  {fields.map((f, idx) => {
                    const actions = getFieldActions(f);
                    const key = f.ID || f.Name || `field-${idx}`;

                    return (
                      <div
                        key={key}
                        style={{
                          padding: "8px",
                          background: "#f9fafb",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            marginBottom: "4px",
                          }}
                        >
                          {safeString(f.Name || f.ID)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          <div>ID: {safeString(f.ID)}</div>
                          <div>Type: {safeString(f.Type)}</div>
                          {f.DataSource ? (
                            <div>
                              Source:{" "}
                              <code
                                style={{
                                  background: "#e5e7eb",
                                  padding: "1px 4px",
                                  borderRadius: "3px",
                                  fontSize: "10px",
                                }}
                              >
                                {safeString(f.DataSource)}
                              </code>
                            </div>
                          ) : null}
                          {actions.length > 0 && (
                            <div>Actions: {actions.join(", ")}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                No form configured for this state
              </div>
            )}
          </section>
        ) : null}

        {selectedEdge ? (
          <section aria-label="Action details">
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Action Name
              </div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>
                {(typeof selectedEdge.label === "string" &&
                  selectedEdge.label) ||
                  "Unnamed Action"}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Flow
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    padding: "4px 8px",
                    background: "#dbeafe",
                    borderRadius: "4px",
                    fontWeight: 500,
                  }}
                >
                  {selectedEdge.source}
                </span>
                <ArrowRight size={16} color="#6b7280" />
                <span
                  style={{
                    padding: "4px 8px",
                    background: "#dcfce7",
                    borderRadius: "4px",
                    fontWeight: 500,
                  }}
                >
                  {selectedEdge.target}
                </span>
              </div>
            </div>

            {(edgeData as EdgeData).operation ? (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Settings size={12} />
                  <span>Operations</span>
                </div>

                <div
                  style={{
                    padding: "8px",
                    background: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {splitOperations((edgeData as EdgeData).operation).map(
                    (op, idx, arr) => (
                      <div
                        key={`${op}-${idx}`}
                        style={{
                          padding: "4px 0",
                          borderBottom:
                            idx < arr.length - 1 ? "1px solid #e5e7eb" : "none",
                        }}
                      >
                        • {op.trim()}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default DetailPanel;
