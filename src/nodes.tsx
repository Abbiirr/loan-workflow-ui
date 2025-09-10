import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ProcessNode({ data, selected }: NodeProps) {
  return (
    <div className={`node process${selected ? " selected" : ""}`} role="graphics-symbol" aria-label={`${data.label} (${data.role})`}>
      <div className="title">{data.label}</div>
      <div className="role">{data.role}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function DecisionNode({ data, selected }: NodeProps) {
  return (
    <div className={`node decision${selected ? " selected" : ""}`} role="graphics-symbol" aria-label={`${data.label} (Decision)`}>
      <div className="diamond">
        <div className="label">{data.label}</div>
      </div>
      <div className="role">{data.role}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
};
