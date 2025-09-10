import {
  ReactFlow, Background, Controls, MiniMap, Position,
  useEdgesState, useNodesState, MarkerType,
  type Edge, type Node, getNodesBounds, getViewportForBounds, useReactFlow
} from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import * as htmlToImage from "html-to-image";
import { MOCK_GRAPH, SAMPLE_CASES } from "./mock";
import type { NodeData } from "./mock";
import { nodeTypes } from "./nodes";

const elk = new ELK();

type Config = {
  edgeType: "step" | "smoothstep";
  compact: boolean;
  showLabels: boolean;
  theme: "light" | "dark";
  showLanes: boolean;
  showLegend: boolean;
  laneFilter: "all" | "business" | "crm";
};

const defaultConfig: Config = {
  edgeType: "smoothstep",
  compact: false,
  showLabels: true,
  theme: "light",
  showLanes: true,
  showLegend: false,
  laneFilter: "all",
};

function laneOf(id: string): "business" | "crm" {
  const business = new Set(["arm_draft", "rm_finalize", "th_business", "cbo_div"]);
  return business.has(id) ? "business" : "crm";
}

function baseNodesEdges(cfg: Config) {
  const nodes: Node[] = MOCK_GRAPH.nodes.map((n) => {
    const isDecision = n.kind === "decision" || n.role === "Decision";
    const badges: string[] = [];
    if (n.role?.includes("override")) badges.push("override");
    if (n.id === "cm_observation") badges.push("editable");

    return {
      id: n.id,
      type: isDecision ? "decision" : "process",
      data: { ...n, badges },
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
    label: cfg.showLabels ? e.label : undefined,
    type: cfg.edgeType,
    style:
      e.style === "dashed"
        ? { strokeDasharray: "6 6" }
        : e.style === "dotted"
        ? { strokeDasharray: "2 6" }
        : undefined,
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 6,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return { nodes, edges };
}

async function layoutWithElk(nodes: Node[], edges: Edge[], compact: boolean) {
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.spacing.nodeNode": compact ? "24" : "32",
      "elk.layered.spacing.nodeNodeBetweenLayers": compact ? "54" : "84",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
    },
    children: nodes.map((n) => ({ id: n.id, width: n.width ?? 240, height: n.height ?? 84 })),
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

export default function GraphView() {
  // Config
  const [cfg, setCfg] = useState<Config>(() => {
    const saved = localStorage.getItem("workflow-ui-config");
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  });
  useEffect(() => {
    document.body.classList.toggle("light", cfg.theme === "light");
    localStorage.setItem("workflow-ui-config", JSON.stringify(cfg));
  }, [cfg]);

  // Base graph -> ELK layout
  const base = useMemo(() => baseNodesEdges(cfg), [cfg.edgeType, cfg.showLabels]);
  const [nodes, setNodes, onNodesChange] = useNodesState(base.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(base.edges);

  const [search, setSearch] = useState("");
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const rf = useReactFlow();
  const flowRef = useRef<HTMLDivElement | null>(null);

  // First layout & whenever “compact” toggles or edges/nodes rebuild
  useEffect(() => {
    (async () => {
      const { nodes: ln, edges: le } = await layoutWithElk(base.nodes, base.edges, cfg.compact);
      setNodes(ln); setEdges(le);
      setTimeout(() => (rf as any)?.fitView?.({ padding: 0.2 }), 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.compact, base.nodes, base.edges]);

  // Path highlight
  const highlight = useMemo(() => {
    if (!activeCaseId || !currentNode) return { nodes: new Set<string>(), edges: new Set<string>() };
    // DFS from start to current
    const adj = new Map<string, Edge[]>();
    edges.forEach((e) => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      adj.get(e.source)!.push(e);
    });
    const start = "arm_draft";
    const parent = new Map<string, { via: Edge; prev: string }>();
    const seen = new Set([start]);
    const st = [start];
    while (st.length) {
      const u = st.pop()!;
      if (u === currentNode) break;
      for (const e of adj.get(u) ?? []) {
        const v = e.target!;
        if (!seen.has(v)) { seen.add(v); parent.set(v, { via: e, prev: u }); st.push(v); }
      }
    }
    if (!seen.has(currentNode)) return { nodes: new Set(), edges: new Set() };
    const ns = new Set<string>(); const es = new Set<string>();
    let cur = currentNode;
    ns.add(cur);
    while (cur !== start) { const p = parent.get(cur)!; es.add(p.via.id); ns.add(p.prev); cur = p.prev; }
    return { nodes: ns, edges: es };
  }, [edges, activeCaseId, currentNode]);

  // Search
  const onSearch = useCallback(() => {
    const c = SAMPLE_CASES.find((x) => x.id.toLowerCase() === search.trim().toLowerCase());
    if (!c) { setActiveCaseId(null); setCurrentNode(null); return; }
    setActiveCaseId(c.id); setCurrentNode(c.currentNodeId);

    // add SLA badge if remark mentions "2 days"
    setNodes((nds) =>
      nds.map((n) =>
        n.id === c.currentNodeId && /2\s*days/i.test(c.remarks)
          ? { ...n, data: { ...(n.data as NodeData), badges: [ ...(n.data as NodeData).badges ?? [], "sla" ] } }
          : n
      )
    );
  }, [search, setNodes]);

  // Click node -> open drawer
  const onNodeClick = useCallback((_e: any, node: Node) => {
    setDrawerOpen(true); setCurrentNode(node.id);
  }, []);

  // Filtering
  const filteredNodes = useMemo(() => {
    if (cfg.laneFilter === "all") return nodes;
    return nodes.map((n) => ({ ...n, hidden: laneOf(n.id) !== cfg.laneFilter }));
  }, [nodes, cfg.laneFilter]);

  const filteredNodeIds = new Set(filteredNodes.filter((n) => !n.hidden).map((n) => n.id));
  const filteredEdges = useMemo(
    () => edges.map((e) => ({ ...e, hidden: !(filteredNodeIds.has(e.source!) && filteredNodeIds.has(e.target!)) })),
    [edges, filteredNodeIds]
  );

  // Dim non-path when a case is active
  const dimmed = activeCaseId ? 0.18 : 1;
  const paintedNodes = filteredNodes.map((n) => ({
    ...n,
    style: { ...(n.style || {}), opacity: activeCaseId ? (highlight.nodes.has(n.id) ? 1 : dimmed) : 1 },
  }));
  const paintedEdges = filteredEdges.map((e) => ({
    ...e,
    animated: highlight.edges.has(e.id),
    style: { ...(e.style || {}), opacity: activeCaseId ? (highlight.edges.has(e.id) ? 1 : dimmed) : 1, strokeWidth: highlight.edges.has(e.id) ? 2.4 : 1.5 },
  }));

  // Export PNG (full graph)
  const onExportPng = useCallback(async () => {
    // compute bounds of visible nodes
    const b = getNodesBounds(rf.getNodes().filter((n) => !n.hidden));
    const vw = getViewportForBounds(b, 1200, 800, 0.5, 2, 0.1);
    rf.setViewport(vw, { duration: 0 });
    const el = document.querySelector(".react-flow") as HTMLElement;
    const dataUrl = await htmlToImage.toPng(el, { backgroundColor: cfg.theme === "light" ? "#ffffff" : "#0b0c0f" });
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "loan-workflow.png"; a.click();
  }, [rf, cfg.theme]);

  // Re-layout
  const onRelayout = useCallback(async () => {
    const { nodes: ln } = await layoutWithElk(nodes, edges, cfg.compact);
    setNodes(ln);
    setTimeout(() => rf.fitView({ padding: 0.2 }), 0);
  }, [nodes, edges, cfg.compact, rf, setNodes]);

  const activeCase = activeCaseId ? SAMPLE_CASES.find((c) => c.id === activeCaseId) : null;
  const currentNodeData = useMemo(
    () => (currentNode ? (MOCK_GRAPH.nodes as NodeData[]).find((x) => x.id === currentNode) : null),
    [currentNode]
  );

  return (
    <div className="app-shell" role="graphics-document" aria-label="Loan approval workflow graph" ref={flowRef}>
      <div className="topbar">
        <div style={{ fontWeight: 800, marginRight: 10 }}>Loan Approval Workflow</div>

        <input
          className="textfield" placeholder="Search case ID (e.g., APP-24057)"
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()} aria-label="Search by Case ID"
        />
        <button className="btn" onClick={onSearch}>Search</button>

        <div className="toolbar">
          <div className="segment" title="Edge type">
            <button className={clsx({ active: cfg.edgeType === "smoothstep" })} onClick={() => setCfg({ ...cfg, edgeType: "smoothstep" })}>Smooth</button>
            <button className={clsx({ active: cfg.edgeType === "step" })} onClick={() => setCfg({ ...cfg, edgeType: "step" })}>Step</button>
          </div>
          <button className="btn" onClick={() => setCfg({ ...cfg, compact: !cfg.compact })}>{cfg.compact ? "Comfy" : "Compact"}</button>
          <button className="btn" onClick={() => setCfg({ ...cfg, showLabels: !cfg.showLabels })}>{cfg.showLabels ? "Hide labels" : "Show labels"}</button>
          <button className="btn" onClick={() => setCfg({ ...cfg, theme: cfg.theme === "light" ? "dark" : "light" })}>{cfg.theme === "light" ? "Dark" : "Light"}</button>
          <button className="btn" onClick={() => setCfg({ ...cfg, laneFilter: cfg.laneFilter === "all" ? "business" : cfg.laneFilter === "business" ? "crm" : "all" })}>
            {cfg.laneFilter === "all" ? "Lanes: All" : cfg.laneFilter === "business" ? "Lanes: Business" : "Lanes: CRM"}
          </button>
          <button className="btn" onClick={onRelayout}>Re-layout</button>
          <button className="btn" onClick={() => rf.fitView({ padding: 0.2 })}>Fit</button>
          <button className="btn" onClick={onExportPng}>Export</button>
          <button className="btn" onClick={() => setCfg({ ...cfg, showLegend: !cfg.showLegend })}>{cfg.showLegend ? "Legend ▲" : "Legend ▼"}</button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {cfg.showLanes && (
          <div className="lanes" aria-hidden="true">
            <div className={clsx("lane business")} data-label="Business" style={{ top: 0, height: "50%" }} />
            <div className={clsx("lane crm")} data-label="CRM" style={{ bottom: 0, height: "50%" }} />
          </div>
        )}

        <ReactFlow
          nodes={paintedNodes}
          edges={paintedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          aria-roledescription="workflow graph canvas"
        >
          <MiniMap />
          <Controls />
          <Background gap={24} />
        </ReactFlow>

        {cfg.showLegend && (
          <div className="legend" role="note" aria-label="Legend">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Workflow Legend</div>
            <div>■ Process step</div><div>◆ Decision point</div>
            <div style={{ marginTop: 8 }}>
              <svg width="120" height="40"><line x1="6" y1="12" x2="114" y2="12" stroke="#6b7280" strokeWidth="2" /><text x="6" y="30" fontSize="11" fill="#6b7280">Forward</text></svg>
            </div>
            <div><svg width="120" height="40"><line x1="6" y1="12" x2="114" y2="12" stroke="#6b7280" strokeWidth="2" strokeDasharray="6 6" /><text x="6" y="30" fontSize="11" fill="#6b7280">Send back</text></svg></div>
            <div><svg width="120" height="40"><line x1="6" y1="12" x2="114" y2="12" stroke="#6b7280" strokeWidth="2" strokeDasharray="2 6" /><text x="6" y="30" fontSize="11" fill="#6b7280">Assignment</text></svg></div>
            <div style={{ marginTop: 8 }}>
              <div className="badge override">Override</div>
              <div className="badge sla">&gt; 2 days</div>
              <div className="badge editable">Editable</div>
            </div>
          </div>
        )}

        <aside className={clsx("drawer", drawerOpen && "open")} role="complementary" aria-label="Node details">
          <h3>Details</h3>
          <div className="section">
            <div style={{ color: "var(--muted)", marginBottom: 8 }}>
              <div style={{ fontSize: 13 }}>Node</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{currentNodeData?.label ?? "—"}</div>
              <div>Role: {currentNodeData?.role ?? "—"}</div>
            </div>
            {activeCase && (
              <>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--text)" }}>
                  <strong>Case:</strong> {activeCase.id} — {activeCase.applicant}
                </div>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <div>Status: {activeCase.status}</div>
                  <div>Product: {activeCase.product}</div>
                  <div>Amount: {activeCase.amount.toLocaleString()}</div>
                  <div style={{ marginTop: 8, color: "var(--muted)" }}>Remarks: {activeCase.remarks}</div>
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
