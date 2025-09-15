export interface Field {
  ID: string;
  Name: string;
  Type: string;
  DataSource: string;
  Actions: string[];
}

export interface Form {
  Fields: Field[];
}

export interface State {
  Form?: Form;
  [key: string]: any;
}

export interface Action {
  NextState: string;
  Operation: string;
}

export interface Workflow {
  States: Record<string, State>;
  Actions: Record<string, Action>;
}

export interface WorkflowConfig {
  Workflow: Workflow;
}

export interface GraphNode {
  id: string;
  type: string;
  data: {
    label: string;
    state: State;
    hasForm: boolean;
    fields?: Field[];
  };
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    actionName: string;
    operation: string;
  };
}
