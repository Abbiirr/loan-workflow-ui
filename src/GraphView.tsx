import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Position,
  useEdgesState,
  useNodesState,
  MarkerType,
  type Edge,
  type Node,
} from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { MOCK_GRAPH, SAMPLE_CASES } from "./mock";
import type { NodeData } from "./mock";
import { nodeTypes } from "./nodes";

const elk = new ELK();

async function layoutWithElk(nodes: Node[], edges: Edge[]) {
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",               // top -> bottom
      "elk.spacing.nodeNode": "32",
      "elk.layered.spacing.nodeNodeBetweenLayers": "72",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.width ?? 240,
      height: n.height ?? 84,
    })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source!], targets: [e.target!] })),
  };

  const res = await elk.layout(elkGraph);
  const pos = new Map<string, { x: number; y: number }>();
  res.children?.forEach((c) => pos.set(c.id, { x: c.x ?? 0, y: c.y ?? 0 }));

  return {
    nodes: nodes.map((n) => ({
      ...n,
      position: pos.get(n.id) ?? { x: 0, y: 0 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    })),
    edges,
  };
}

function toNodesEdges() {
  const nodes: Node[] = MOCK_GRAPH.nodes.map((n) => {
    const isDecision = n.kind === "decision" || n.role === "Decision";
    return {
      id: n.id,
      type: isDecision ? "decision" : "process",
      data: n,
      position: { x: 0, y: 0 },
      width: isDecision ? 120 : 260,
      height: isDecision ? 120 : 84,
      className: "rf-node",
    };
  });

  const edges: Edge[] = MOCK_GRAPH.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    label: e.label,
    type: "smoothstep", // cleaner than bezier for layered layouts
    style:
      e.style === "dashed"
        ? { strokeDasharray: "6 6" }
        : e.style === "dotted"
        ? { strokeDasharray: "2 6" }
        : undefined,
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 6,
  }));

  return { nodes, edges };
}

function findCaseById(id: string) {
  return SAMPLE_CASES.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

function computePath(edges: Edge[], startId: string, targetId: string) {
  const adj = new Map<string, Edge[]>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e);
  });

  const visited = new Set<string>([startId]);
  const parent = new Map<string, { via: Edge; prev: string }>();
  const stack = [startId];

  while (stack.length) {
    const u = stack.pop()!;
    if (u === targetId) break;
    for (const e of adj.get(u) ?? []) {
      const v = e.target!;
      if (!visited.has(v)) {
        visited.add(v);
        parent.set(v, { via: e, prev: u });
        stack.push(v);
      }
    }
  }

  if (!visited.has(targetId)) return { nodes: new Set<string>(), edges: new Set<string>() };

  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  let cur = targetId;
  nodeIds.add(cur);
  while (cur !== startId) {
    const p = parent.get(cur)!;
    edgeIds.add(p.via.id);
    nodeIds.add(p.prev);
    cur = p.prev;
  }
  return { nodes: nodeIds, edges: edgeIds };
}

export default function GraphView() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => toNodesEdges(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [lanesOn, setLanesOn] = useState(true);
  const [legendOn, setLegendOn] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const flowRef = useRef<any>(null);

  useEffect(() => {
    layoutWithElk(nodes, edges).then(({ nodes: ln, edges: le }) => {
      setNodes(ln);
      setEdges(le);
      setTimeout(() => flowRef.current?.fitView?.({ padding: 0.2 }), 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlight = useMemo(() => {
    if (!activeCaseId || !currentNode) return { nodes: new Set<string>(), edges: new Set<string>() };
    return computePath(edges, "arm_draft", currentNode);
  }, [edges, activeCaseId, currentNode]);

  const onSearch = useCallback(() => {
    const c = findCaseById(search.trim());
    if (!c) {
      setActiveCaseId(null);
      setCurrentNode(null);
      return;
    }
    setActiveCaseId(c.id);
    setCurrentNode(c.currentNodeId);
    const n = document.querySelector(`[data-id="${c.currentNodeId}"]`) as HTMLElement | null;
    if (n) {
      n.classList.add("focus-ring");
      setTimeout(() => n.classList.remove("focus-ring"), 1200);
    }
  }, [search]);

  const onNodeClick = useCallback((_e: any, node: Node) => {
    setDrawerOpen(true);
    setCurrentNode(node.id);
  }, []);

  const dimmed = activeCaseId ? 0.2 : 1;

  const paintedNodes = nodes.map((n) => {
    const d = n.data as NodeData;
    const onPath = highlight.nodes.has(n.id);
    return {
      ...n,
      style: {
        ...(n.style || {}),
        opacity: activeCaseId ? (onPath ? 1 : dimmed) : 1,
      },
      data: d,
    };
  });

  const paintedEdges = edges.map((e) => {
    const onPath = highlight.edges.has(e.id);
    return {
      ...e,
      animated: onPath,
      style: {
        ...(e.style || {}),
        opacity: activeCaseId ? (onPath ? 1 : dimmed) : 1,
        strokeWidth: onPath ? 2.5 : 1.5,
      },
      labelStyle: { fill: "#cdd6e8" },
    };
  });

  const activeCase = activeCaseId ? SAMPLE_CASES.find((c) => c.id === activeCaseId) : null;
  const currentNodeData = useMemo(
    () => (currentNode ? (MOCK_GRAPH.nodes as NodeData[]).find((x) => x.id === currentNode) : null),
    [currentNode]
  );

  return (
    <div className="app-shell" role="graphics-document" aria-label="Loan approval workflow graph">
      <div className="topbar">
        <input
          className="textfield"
          placeholder="Search Case ID (e.g., APP-24057)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          aria-label="Search by Case ID"
        />
        <button className="btn" onClick={onSearch} aria-label="Highlight path for case">Search</button>
        <label className="switch" aria-label="Toggle lanes">
          <input type="checkbox" checked={lanesOn} onChange={(e) => setLanesOn(e.target.checked)} aria-checked={lanesOn} />
          <span>Show lanes</span>
        </label>
        <button className="btn" onClick={() => setLegendOn((v) => !v)} aria-expanded={legendOn}>
          {legendOn ? "Hide Legend" : "Show Legend"}
        </button>
        <div style={{ marginLeft: "auto", color: "var(--muted)" }}>Viewer prototype — pan/zoom, fit/reset, details, legend</div>
      </div>

      <div style={{ position: "relative" }}>
        {lanesOn && (
          <div className="lanes" aria-hidden="true">
            <div className={clsx("lane business")} style={{ top: 0, height: "50%" }} title="Business lane" />
            <div className={clsx("lane crm")} style={{ bottom: 0, height: "50%" }} title="CRM lane" />
          </div>
        )}

        <ReactFlow
          ref={flowRef}
          nodes={paintedNodes}
          edges={paintedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          defaultEdgeOptions={{ type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          aria-roledescription="workflow graph canvas"
        >
          <MiniMap />
          <Controls />
          <Background gap={24} />
        </ReactFlow>

        {legendOn && (
          <div className="legend" role="note" aria-label="Legend">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Legend</div>
            <div>■ Process step (box)</div>
            <div>◆ Decision (diamond)</div>
            <div style={{ marginTop: 8 }}>
              <svg width="120" height="40">
                <line x1="6" y1="12" x2="114" y2="12" stroke="#cdd6e8" strokeWidth="2" />
                <text x="6" y="30" fontSize="11" fill="#cdd6e8">Forward</text>
              </svg>
            </div>
            <div>
              <svg width="120" height="40">
                <line x1="6" y1="12" x2="114" y2="12" stroke="#cdd6e8" strokeWidth="2" strokeDasharray="6 6" />
                <text x="6" y="30" fontSize="11" fill="#cdd6e8">Send-back</text>
              </svg>
            </div>
            <div>
              <svg width="120" height="40">
                <line x1="6" y1="12" x2="114" y2="12" stroke="#cdd6e8" strokeWidth="2" strokeDasharray="2 6" />
                <text x="6" y="30" fontSize="11" fill="#cdd6e8">Assignment</text>
              </svg>
            </div>
          </div>
        )}

        <aside className={clsx("drawer", drawerOpen && "open")} role="complementary" aria-label="Node details">
          <h3>Details</h3>
          <div className="section">
            <div style={{ color: "#cdd6e8", marginBottom: 8 }}>
              <div style={{ fontSize: 13 }}>Node</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{currentNodeData?.label ?? "—"}</div>
              <div style={{ color: "var(--muted)", marginTop: 2 }}>Role: {currentNodeData?.role ?? "—"}</div>
            </div>
            {activeCase && (
              <>
                <div style={{ marginTop: 12, fontSize: 13, color: "#cdd6e8" }}>
                  <strong>Case:</strong> {activeCase.id} — {activeCase.applicant}
                </div>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <div>Status: {activeCase.status}</div>
                  <div>Product: {activeCase.product}</div>
                  <div>Amount: {activeCase.amount.toLocaleString()}</div>
                  <div style={{ marginTop: 8 }}>Remarks: {activeCase.remarks}</div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 600 }}>Attachments</div>
                    {activeCase.attachments.length === 0 && <div>None</div>}
                    <ul>{activeCase.attachments.map((a) => (<li key={a.name}>{a.name} — {a.size}</li>))}</ul>
                  </div>
                </div>
              </>
            )}
            <div style={{ marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
              Next actions (hint): forward or send-back depending on node; viewer is read-only.
            </div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => setDrawerOpen(false)}>Close</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
