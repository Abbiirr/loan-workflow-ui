import { MarkerType } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import type { WorkflowConfig } from '../types/workflow.types';

export const parseWorkflowToGraph = (config: WorkflowConfig): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  if (!config?.Workflow) {
    return { nodes, edges };
  }
  
  const { States, Actions } = config.Workflow;
  
  // Create nodes from states
  const stateKeys = Object.keys(States || {});
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 200;
  const COLUMNS = 3;
  
  stateKeys.forEach((stateKey, index) => {
    const state = States[stateKey];
    const row = Math.floor(index / COLUMNS);
    const col = index % COLUMNS;
    
    nodes.push({
      id: stateKey,
      type: 'stateNode',
      position: { 
        x: col * HORIZONTAL_SPACING + 100, 
        y: row * VERTICAL_SPACING + 100 
      },
      data: {
        label: stateKey,
        state: state,
        hasForm: !!state?.Form,
        fields: state?.Form?.Fields || []
      }
    });
  });
  
  // Create edges from actions
  if (Actions) {
    Object.entries(Actions).forEach(([actionName, action]) => {
      // Find source state for this action
      const sourceState = findSourceState(actionName, stateKeys);
      
      if (sourceState && action.NextState) {
        edges.push({
          id: `${sourceState}-to-${action.NextState}`,
          source: sourceState,
          target: action.NextState,
          label: actionName,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          style: {
            stroke: '#3b82f6',
            strokeWidth: 2,
          },
          data: {
            actionName: actionName,
            operation: action.Operation
          }
        });
      }
    });
  }
  
  // Handle implicit edges (State1 -> State2, State2 -> State3, etc.)
  for (let i = 0; i < stateKeys.length - 1; i++) {
    const currentState = stateKeys[i];
    const nextState = stateKeys[i + 1];
    
    // Check if edge already exists
    const edgeExists = edges.some(e => 
      e.source === currentState && e.target === nextState
    );
    
    if (!edgeExists) {
      edges.push({
        id: `${currentState}-to-${nextState}`,
        source: currentState,
        target: nextState,
        label: 'Next',
        type: 'smoothstep',
        style: {
          stroke: '#9ca3af',
          strokeWidth: 1,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
        }
      });
    }
  }
  
  return { nodes, edges };
};

function findSourceState(actionName: string, stateKeys: string[]): string | null {
  const actionLower = actionName.toLowerCase();
  
  for (const state of stateKeys) {
    if (actionLower.includes(state.toLowerCase())) {
      return state;
    }
  }
  
  if (actionLower.includes('finalize') || actionLower.includes('submit')) {
    return stateKeys.length >= 2 ? stateKeys[stateKeys.length - 2] : stateKeys[0];
  }
  
  if (actionLower.includes('review') || actionLower.includes('approve')) {
    return stateKeys[stateKeys.length - 1];
  }
  
  return stateKeys[0];
}

export const getDefaultWorkflow = (): WorkflowConfig => ({
  Workflow: {
    States: {
      "Application": {
        Form: {
          Fields: [
            {
              ID: "name",
              Name: "Applicant Name",
              Type: "text",
              DataSource: "{{ data.fields.name }}",
              Actions: ["validate", "autofill"]
            },
            {
              ID: "amount",
              Name: "Loan Amount",
              Type: "number",
              DataSource: "{{ data.fields.amount }}",
              Actions: ["calculate"]
            },
            {
              ID: "purpose",
              Name: "Loan Purpose",
              Type: "select",
              DataSource: "{{ data.fields.purpose }}",
              Actions: []
            }
          ]
        }
      },
      "Review": {
        Form: {
          Fields: [
            {
              ID: "credit_score",
              Name: "Credit Score",
              Type: "number",
              DataSource: "{{ data.credit.score }}",
              Actions: ["fetch", "validate"]
            },
            {
              ID: "risk_assessment",
              Name: "Risk Assessment",
              Type: "select",
              DataSource: "{{ data.risk.level }}",
              Actions: ["calculate"]
            }
          ]
        }
      },
      "Approval": {
        Form: {
          Fields: [
            {
              ID: "decision",
              Name: "Decision",
              Type: "select",
              DataSource: "{{ data.decision }}",
              Actions: ["notify"]
            },
            {
              ID: "notes",
              Name: "Approval Notes",
              Type: "textarea",
              DataSource: "{{ data.notes }}",
              Actions: []
            }
          ]
        }
      },
      "Disbursement": {}
    },
    Actions: {
      "Submit": {
        NextState: "Review",
        Operation: "Validate, Save, Notify reviewer"
      },
      "Approve": {
        NextState: "Approval",
        Operation: "Check credit, Calculate risk, Assign approver"
      },
      "Finalize": {
        NextState: "Disbursement",
        Operation: "Generate documents, Send email, Transfer funds"
      }
    }
  }
});
