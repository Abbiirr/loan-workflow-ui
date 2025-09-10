import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Position,
  type Node,
  type Edge,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import * as htmlToImage from "html-to-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nodeTypes } from "./nodes";
import { MOCK_GRAPH } from "./mock";
import type { NodeData } from "./mock";

const elk = new ELK();

/* -------- util -------- */
const genId = (() => {
  let i = 0;
  return (p = "n") => `${p}-${++i}`;
})();

type EdgePreset = "forward" | "sendback" | "assign";

function toInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = MOCK_GRAPH.nodes.map((n) => ({
    id: n.id,
    type:
      n.role === "Decision" || n.kind === "decision" ? "decision" : "process",
    data: n,
    position: { x: 0, y: 0 },
    width: n.role === "Decision" ? 120 : 260,
    height: n.role === "Decision" ? 120 : 84,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }));

  const edges: Edge[] = MOCK_GRAPH.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    label: e.label,
    type: "step",
    markerEnd: { type: MarkerType.ArrowClosed },
    style:
      e.style === "dashed"
        ? { strokeDasharray: "6 6" }
        : e.style === "dotted"
        ? { strokeDasharray: "2 6" }
        : undefined,
  }));

  return { nodes, edges };
}

async function elkLayout(nodes: Node[], edges: Edge[], compact = false) {
  const g = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.nodeNode": compact ? "24" : "32",
      "elk.layered.spacing.nodeNodeBetweenLayers": compact ? "54" : "84",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.width ?? 240,
      height: n.height ?? 84,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source!],
      targets: [e.target!],
    })),
  } as const;

  const res = await elk.layout(g);
  const pos = new Map<string, { x: number; y: number }>();
  res.children?.forEach((c) => pos.set(c.id, { x: c.x ?? 0, y: c.y ?? 0 }));

  return nodes.map((n) => ({
    ...n,
    position: pos.get(n.id) ?? n.position,
  }));
}

/* -------- undo/redo (snapshot-based) -------- */
type Snapshot = { nodes: Node[]; edges: Edge[] };
function useHistory(initial: Snapshot) {
  const [present, setPresent] = useState<Snapshot>(initial);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const set = (s: Snapshot) => {
    setPast((p) => [...p, present]);
    setFuture([]);
    setPresent(s);
  };
  const undo = () => {
    setPast((p) => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [present, ...f]);
      setPresent(prev);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setPast((p) => [...p, present]);
      setPresent(next);
      return f.slice(1);
    });
  };
  return {
    present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

/* -------- component -------- */
export default function WorkflowMaker() {
  const base = useMemo(() => toInitialGraph(), []);
  const history = useHistory({ nodes: base.nodes, edges: base.edges });
  const [nodes, setNodes, onNodesChange] = useNodesState(history.present.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(history.present.edges);

  const rf = useReactFlow();
  const flowRef = useRef<HTMLDivElement | null>(null);

  // selection state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // maker UI state
  const [edgePreset, setEdgePreset] = useState<EdgePreset>("forward");
  const [compact, setCompact] = useState(false);
  const [lanes, setLanes] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);

  // hydrate nodes from history on change
  useEffect(() => {
    setNodes(history.present.nodes);
    setEdges(history.present.edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.present]);

  // drag from left rail → drop on canvas (React Flow DnD pattern)
  const onDragStart = (e: React.DragEvent, kind: "process" | "decision") => {
    e.dataTransfer.setData("application/reactflow", kind);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData("application/reactflow") as
      | "process"
      | "decision";
    if (!kind) return;
    const pos = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const id = genId(kind === "process" ? "step" : "decision");
    const data: NodeData =
      kind === "decision"
        ? { id, label: "Decision", role: "Decision" }
        : { id, label: "New Step", role: "Role" };
    const n: Node = {
      id,
      type: kind,
      data,
      position: pos,
      width: kind === "decision" ? 120 : 260,
      height: kind === "decision" ? 120 : 84,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
    const newNodes = [...nodes, n];
    history.set({ nodes: newNodes, edges });
  };
  // connect edges with preset style
  const onConnect = useCallback(
    (conn: any) => {
      const style =
        edgePreset === "sendback"
          ? { strokeDasharray: "6 6" }
          : edgePreset === "assign"
          ? { strokeDasharray: "2 6" }
          : undefined;

      const e: Edge = addEdge(
        {
          ...conn,
          id: genId("e"),
          type: "step",
          markerEnd: { type: MarkerType.ArrowClosed },
          label:
            edgePreset === "sendback"
              ? "Send back"
              : edgePreset === "assign"
              ? "Assign"
              : "Forward",
          style,
        },
        edges
      ) as any;

      history.set({ nodes, edges: e });
    },
    [edges, edgePreset, history, nodes]
  );

  // selection → properties panel
  const onSelectionChange = useCallback(
    ({ nodes: ns, edges: es }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNode(ns[0] ?? null);
      setSelectedEdge(es[0] ?? null);
    },
    []
  );

  // properties edits
  const mutateNode = (id: string, patch: Partial<NodeData>) => {
    const updated = nodes.map((n) =>
      n.id === id ? { ...n, data: { ...(n.data as NodeData), ...patch } } : n
    );
    history.set({ nodes: updated, edges });
  };
  const mutateEdge = (id: string, patch: Partial<Edge>) => {
    const updated = edges.map((e) => (e.id === id ? { ...e, ...patch } : e));
    history.set({ nodes, edges: updated });
  };

  // auto-arrange
  const relayout = async () => {
    const laidOut = await elkLayout(nodes, edges, compact);
    history.set({ nodes: laidOut, edges });
    setTimeout(() => rf.fitView({ padding: 0.15 }), 0);
  };

  // export (JSON + PNG)
  const exportJson = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            nodes: nodes.map((n) => ({
              id: n.id,
              label: (n.data as NodeData).label,
              role: (n.data as NodeData).role,
            })),
            edges: edges.map((e) => ({
              from: e.source,
              to: e.target,
              label: e.label,
            })),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "workflow.json";
    a.click();
  };

  const exportPng = async () => {
    const bounds = getNodesBounds(nodes.filter((n) => !n.hidden));
    const vp = getViewportForBounds(bounds, 1200, 800, 0.5, 2, 0.1);
    rf.setViewport(vp, { duration: 0 });
    const el = document.querySelector(".react-flow") as HTMLElement;
    const dataUrl = await htmlToImage.toPng(el, { backgroundColor: "#ffffff" });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "workflow.png";
    a.click();
  };

  // validate
  const validate = () => {
    const msgs: string[] = [];
    if (!nodes.some((n) => n.id === "arm_draft"))
      msgs.push("Missing start: Draft Proposal (ARM).");
    if (!nodes.some((n) => n.id === "ceo"))
      msgs.push("Missing end: Final Approval (CEO).");
    // orphan nodes
    const deg = new Map(nodes.map((n) => [n.id, 0]));
    edges.forEach((e) => {
      deg.set(e.source!, (deg.get(e.source!) ?? 0) + 1);
      deg.set(e.target!, (deg.get(e.target!) ?? 0) + 1);
      if (!e.label) msgs.push(`Unlabeled edge ${e.id}`);
    });
    nodes.forEach((n) => {
      if ((deg.get(n.id) ?? 0) === 0)
        msgs.push(`Orphan: ${(n.data as NodeData).label || n.id}`);
    });
    setWarnings(msgs);
  };

  // styling helpers
  const paletteBtn = (label: string, kind: "process" | "decision") => (
    <button
      className="palette-item"
      draggable
      onDragStart={(e) => onDragStart(e, kind)}
    >
      {label}
    </button>
  );

  return (
    <div className="maker-shell">
      {/* Left palette (n8n-like) */}
      <aside className="palette">
        <div className="palette-title">Palette</div>
        {paletteBtn("Process Step", "process")}
        {paletteBtn("Decision", "decision")}

        <div className="palette-subhead">New edge preset</div>
        <label className="radio">
          <input
            type="radio"
            name="edge"
            checked={edgePreset === "forward"}
            onChange={() => setEdgePreset("forward")}
          />
          Forward (solid)
        </label>
        <label className="radio">
          <input
            type="radio"
            name="edge"
            checked={edgePreset === "sendback"}
            onChange={() => setEdgePreset("sendback")}
          />
          Send-back (dashed)
        </label>
        <label className="radio">
          <input
            type="radio"
            name="edge"
            checked={edgePreset === "assign"}
            onChange={() => setEdgePreset("assign")}
          />
          Assignment (dotted)
        </label>

        <div className="palette-subhead">Layout</div>
        <button className="btn" onClick={relayout}>
          Auto-arrange
        </button>
        <label className="switch">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
          />
          Compact spacing
        </label>

        <div className="palette-subhead">View</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={lanes}
            onChange={(e) => setLanes(e.target.checked)}
          />
          Show lanes
        </label>

        <div className="palette-subhead">History</div>
        <div className="row">
          <button
            className="btn"
            disabled={!history.canUndo}
            onClick={history.undo}
          >
            Undo
          </button>
          <button
            className="btn"
            disabled={!history.canRedo}
            onClick={history.redo}
          >
            Redo
          </button>
        </div>

        <div className="palette-subhead">Export</div>
        <div className="row">
          <button className="btn" onClick={exportJson}>
            JSON
          </button>
          <button className="btn" onClick={exportPng}>
            PNG
          </button>
        </div>

        <div className="palette-subhead">Validate</div>
        <button className="btn" onClick={validate}>
          Run checks
        </button>
        {warnings.length > 0 && (
          <ul className="warnings">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
      </aside>

      {/* Canvas + lanes */}
      <main
        className="maker-canvas"
        role="graphics-document"
        aria-label="Workflow configuration canvas"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {lanes && (
          <>
            <div className="lane lane-business" aria-hidden="true">
              <span>Business</span>
            </div>
            <div className="lane lane-crm" aria-hidden="true">
              <span>CRM</span>
            </div>
          </>
        )}
        <ReactFlow
          className="rf-area"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(chs) => {
            onNodesChange(chs);
            // take snapshot after drag ends
            const dragging = chs.some(
              (c: any) => c.type === "position" && c.dragging
            );
            if (!dragging)
              history.set({ nodes: rf.getNodes(), edges: rf.getEdges() });
          }}
          onEdgesChange={(chs) => {
            onEdgesChange(chs);
            history.set({ nodes: rf.getNodes(), edges: rf.getEdges() });
          }}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          elementsSelectable
          nodesDraggable
          nodesConnectable
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls />
          <Background gap={24} />
        </ReactFlow>
      </main>

      {/* Properties panel */}
      <aside
        className="maker-props"
        role="complementary"
        aria-label="Properties"
      >
        <div className="props-title">Properties</div>

        {!selectedNode && !selectedEdge && (
          <div className="muted">Select a node or edge.</div>
        )}

        {selectedNode && (
          <div>
            <div className="props-subtitle">Node</div>
            <label className="form-row">
              <span>Title</span>
              <input
                value={(selectedNode.data as NodeData).label ?? ""}
                onChange={(e) =>
                  mutateNode(selectedNode.id, { label: e.target.value })
                }
              />
            </label>
            <label className="form-row">
              <span>Role</span>
              <input
                value={(selectedNode.data as NodeData).role ?? ""}
                onChange={(e) =>
                  mutateNode(selectedNode.id, { role: e.target.value })
                }
              />
            </label>
            <div className="row">
              <button
                className="btn"
                onClick={() => {
                  const filtered = nodes.filter(
                    (n) => n.id !== selectedNode.id
                  );
                  const es = edges.filter(
                    (e) =>
                      e.source !== selectedNode.id &&
                      e.target !== selectedNode.id
                  );
                  history.set({ nodes: filtered, edges: es });
                  setSelectedNode(null);
                }}
              >
                Delete node
              </button>
              <button
                className="btn"
                onClick={() => {
                  const cloneId = genId("step");
                  const nn: Node = {
                    ...selectedNode,
                    id: cloneId,
                    position: {
                      x: selectedNode.position.x + 40,
                      y: selectedNode.position.y + 40,
                    },
                  };
                  history.set({ nodes: [...nodes, nn], edges });
                }}
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div>
            <div className="props-subtitle">Edge</div>
            <label className="form-row">
              <span>Label</span>
              <input
                value={selectedEdge.label?.toString() ?? ""}
                onChange={(e) =>
                  mutateEdge(selectedEdge.id, { label: e.target.value })
                }
              />
            </label>
            <label className="form-row">
              <span>Style</span>
              <select
                value={
                  selectedEdge.style?.strokeDasharray === "6 6"
                    ? "sendback"
                    : selectedEdge.style?.strokeDasharray === "2 6"
                    ? "assign"
                    : "forward"
                }
                onChange={(e) => {
                  const v = e.target.value as EdgePreset;
                  mutateEdge(
                    selectedEdge.id,
                    v === "sendback"
                      ? { style: { strokeDasharray: "6 6" } }
                      : v === "assign"
                      ? { style: { strokeDasharray: "2 6" } }
                      : { style: undefined }
                  );
                }}
              >
                <option value="forward">Forward (solid)</option>
                <option value="sendback">Send-back (dashed)</option>
                <option value="assign">Assignment (dotted)</option>
              </select>
            </label>
            <div className="row">
              <button
                className="btn"
                onClick={() => {
                  history.set({
                    nodes,
                    edges: edges.filter((e) => e.id !== selectedEdge.id),
                  });
                  setSelectedEdge(null);
                }}
              >
                Delete edge
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
