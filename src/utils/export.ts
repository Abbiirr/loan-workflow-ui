// src/utils/export.ts
export type GraphExportData = {
  nodes: Array<{ id: string; position: { x: number; y: number }; data: unknown }>;
  edges: Array<{ source: string; target: string; label?: string; data?: unknown }>;
};

export function exportGraphToJson(data: GraphExportData, filename = "workflow-graph.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
