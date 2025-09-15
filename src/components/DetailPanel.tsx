import React from "react";
import { X, ArrowRight, FileText, Settings, Eye } from "lucide-react";
import type { Node, Edge } from "reactflow";

interface DetailPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onClose: () => void;
  onViewForm?: (nodeId: string) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedNode,
  selectedEdge,
  onClose,
  onViewForm,
}) => {
  if (!selectedNode && !selectedEdge) return null;

  const nodeData: Record<string, unknown> =
    (selectedNode?.data as Record<string, unknown>) ?? {};
  const edgeData: Record<string, unknown> =
    (selectedEdge?.data as Record<string, unknown>) ?? {};

  const fields: unknown[] = Array.isArray(nodeData.fields)
    ? (nodeData.fields as unknown[])
    : [];

  const safeString = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    )
      return String(v);
    return "";
  };

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "320px",
        background: "white",
        borderLeft: "1px solid #e5e7eb",
        boxShadow: "-4px 0 6px rgba(0,0,0,0.05)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
          {selectedNode ? "State Details" : "Action Details"}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
        {selectedNode && (
          <section aria-label="State details">
            {Boolean(nodeData.hasForm) && (
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
                  fontWeight: "500",
                }}
              >
                <Eye size={16} />
                Form View
              </button>
            )}

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
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
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
                  {fields.map((field, idx) => {
                    // normalize actions
                    const f = field as Record<string, unknown>;
                    let actions: string[] = [];
                    if (Array.isArray(f.Actions))
                      actions = (f.Actions as unknown[])
                        .map((a) => safeString(a))
                        .filter(Boolean);
                    else if (Array.isArray(f.FieldActions)) {
                      actions = (f.FieldActions as unknown[])
                        .map((a) => {
                          const aRec = a as Record<string, unknown>;
                          return safeString(aRec.Operation);
                        })
                        .filter(Boolean);
                    }

                    const key =
                      f.ID !== undefined && f.ID !== null
                        ? safeString(f.ID)
                        : `field-${idx}`;

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
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                        >
                          {safeString(f.Name)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          <div>ID: {safeString(f.ID)}</div>
                          <div>Type: {safeString(f.Type)}</div>
                          {f.DataSource && (
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
                          )}
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
        )}

        {selectedEdge && (
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
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {selectedEdge.label || "Unnamed Action"}
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
                    fontWeight: "500",
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
                    fontWeight: "500",
                  }}
                >
                  {selectedEdge.target}
                </span>
              </div>
            </div>

            {edgeData.operation && (
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
                  {String(edgeData.operation)
                    .split(",")
                    .map((op: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: "4px 0",
                          borderBottom:
                            idx <
                            String(edgeData.operation).split(",").length - 1
                              ? "1px solid #e5e7eb"
                              : "none",
                        }}
                      >
                        • {op.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
