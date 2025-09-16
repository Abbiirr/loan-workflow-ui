// src/features/workflow/utils/graphParser.ts
import type { Node, Edge } from "reactflow";
import type { WorkflowConfig } from "@features/workflow/types/workflow.types";

export function parseWorkflowToGraph(workflow: WorkflowConfig): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!workflow?.Workflow?.States) {
    return { nodes, edges };
  }

  const states = workflow.Workflow.States;
  const stateKeys = Object.keys(states);

  // Create nodes
  stateKeys.forEach((stateKey, index) => {
    const state = states[stateKey];
    const hasForm = Boolean(state?.Form?.Fields?.length);

    nodes.push({
      id: stateKey,
      type: "stateNode",
      position: {
        x: 250 * (index % 3),
        y: 200 * Math.floor(index / 3),
      },
      data: {
        label: stateKey,
        hasForm,
        fields: state?.Form?.Fields || [],
      },
    });
  });

  // Create edges ONLY from Actions defined in each State
  stateKeys.forEach((stateKey) => {
    const state = states[stateKey];
    if (state?.Actions && typeof state.Actions === "object") {
      Object.entries(state.Actions).forEach(([actionName, actionData]) => {
        if (actionData?.NextState && states[actionData.NextState]) {
          let stroke = "#6b7280";
          if (actionName.includes("Reject")) {
            stroke = "#ef4444";
          } else if (actionName.includes("Approve")) {
            stroke = "#10b981";
          }
          edges.push({
            id: `${stateKey}-${actionName}-${actionData.NextState}`,
            source: stateKey,
            target: actionData.NextState,
            label: actionName,
            type: "smoothstep",
            animated: true,
            style: { stroke },
            data: { operation: actionData.Operation },
          });
        }
      });
    }
  });

  return { nodes, edges };
}

export function getDefaultWorkflow(): WorkflowConfig {
  return {
    Workflow: {
      States: {
        Start: {
          Form: {
            Fields: [
              {
                ID: "name",
                Name: "Applicant Name",
                Type: "text",
                DataSource: "{{ data.applicant.name }}",
                FieldActions: [{ Operation: "validate" }],
              },
            ],
          },
          Actions: {
            Submit: {
              NextState: "Review",
              Operation: "Save and notify reviewer",
            },
          },
        },
        Review: {
          Form: {
            Fields: [
              {
                ID: "decision",
                Name: "Decision",
                Type: "select",
                DataSource: "{{ data.review.decision }}",
                FieldActions: [{ Operation: "validate" }],
              },
            ],
          },
          Actions: {
            Approve: {
              NextState: "Complete",
              Operation: "Approve application",
            },
            Reject: {
              NextState: "Start",
              Operation: "Return to applicant",
            },
          },
        },
        Complete: {},
      },
    },
  };
}
