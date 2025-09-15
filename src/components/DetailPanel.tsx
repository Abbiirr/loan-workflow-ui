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
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
        {selectedNode && (
          <>
            {/* Form View button */}
            {selectedNode.data.hasForm && (
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
              <label
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                State Name
              </label>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {selectedNode.data.label}
              </div>
            </div>

            {selectedNode.data.hasForm && (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    <FileText
                      size={12}
                      style={{ display: "inline", marginRight: "4px" }}
                    />
                    Form Fields ({selectedNode.data.fields?.length || 0})
                  </label>
                  <div style={{ display: "block" }}>
                    {selectedNode.data.fields?.map(
                      (field: any, idx: number) => (
                        <div
                          key={idx}
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
                            {field.Name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>
                            <div>ID: {field.ID}</div>
                            <div>Type: {field.Type}</div>
                            {field.DataSource && (
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
                                  {field.DataSource}
                                </code>
                              </div>
                            )}
                            {field.Actions.length > 0 && (
                              <div>Actions: {field.Actions.join(", ")}</div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            {!selectedNode.data.hasForm && (
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
          </>
        )}

        {selectedEdge && (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Action Name
              </label>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {selectedEdge.label || "Unnamed Action"}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Flow
              </label>
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

            {selectedEdge.data?.operation && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  <Settings
                    size={12}
                    style={{ display: "inline", marginRight: "4px" }}
                  />
                  Operations
                </label>
                <div
                  style={{
                    padding: "8px",
                    background: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {selectedEdge.data.operation
                    .split(",")
                    .map((op: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: "4px 0",
                          borderBottom:
                            idx <
                            selectedEdge.data.operation.split(",").length - 1
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
          </>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
