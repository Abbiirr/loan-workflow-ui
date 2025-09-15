export interface FieldAction {
  Operation: string;
}

export interface Field {
  ID: string;
  Name: string;
  Type: string;
  DataSource: string;
  FieldActions: FieldAction[];  // Changed from Actions: string[]
}

export interface StateAction {
  NextState: string;
  Operation: string;
}

export interface State {
  Form?: Form;
  Actions?: Record<string, StateAction>;  // Actions now inside State
}

export interface Workflow {
  States: Record<string, State>;
  // Remove Actions from here - they're inside States now
}