// StateNode.tsx - single clean implementation
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
import "./StateNode.css";
import type { Field } from "@features/workflow/types/workflow.types";

const getFieldIcon = (type?: string) => {
  if (!type) return <Type size={12} />;
  switch (type?.toLowerCase()) {
    case "number":
      return <Hash size={12} />;
    case "select":
      return <List size={12} />;
    default:
      return <Type size={12} />;
  }
};

const StateNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`state-node ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Top} className="handle-accent" />

      <div className="state-node-title">{data.label}</div>

      {data.hasForm ? (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="state-node-toggle"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <FileText size={14} />
            <span>{data.fields?.length || 0} fields</span>
          </button>

          {expanded && data.fields && (
            <div className="state-node-fields">
              {data.fields.map((field: Field) => (
                <div key={field.ID || field.Name} className="state-node-field">
                  {getFieldIcon(field.Type)}
                  <div>
                    <div className="state-node-field-name">
                      {field.Name || field.ID}
                    </div>
                    {field.FieldActions && field.FieldActions.length > 0 && (
                      <div className="state-node-field-actions">
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
      ) : (
        <div className="state-node-noform">No form configured</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle-accent"
      />
    </div>
  );
};

export default StateNode;
