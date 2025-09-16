// src/features/workflow/types/workflow.types.ts
export interface FieldAction {
  Operation: string;
}

export interface Field {
  ID: string;
  Name: string;
  Type: string;
  DataSource: string;
  FieldActions?: FieldAction[];
  Actions?: string[]; // Legacy support
}

export interface StateAction {
  NextState: string;
  Operation: string;
}

export interface State {
  Form?: {
    Fields: Field[];
  };
  Actions?: Record<string, StateAction>; // Actions are INSIDE each State
}

export interface WorkflowConfig {
  Workflow: {
    States: Record<string, State>;
  };
}
