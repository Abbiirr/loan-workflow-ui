import GraphView from "./GraphView";
import { ReactFlowProvider } from "@xyflow/react";

export default function App() {
  return (
    <ReactFlowProvider>
      <GraphView />
    </ReactFlowProvider>
  );
}
