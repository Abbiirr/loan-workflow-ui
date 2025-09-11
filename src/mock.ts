export type NodeData = {
  id: string;
  label: string;
  role: string;
  badges?: string[];
  kind?: "process" | "decision";
};

export type EdgeData = {
  from: string;
  to: string;
  label: string;
  style?: "dashed" | "dotted" | "decision";
};

export const MOCK_GRAPH = {
  nodes: [
    { id: "arm_draft", label: "Draft Proposal", role: "ARM" },
    { id: "rm_finalize", label: "Finalize & Submit", role: "RM (override)" },
    { id: "th_business", label: "Business Review", role: "Team Head–Business / Business Lead (override)" },
    { id: "cbo_div", label: "Seek Recommendation", role: "CBO / Head of Division (optional)" },
    { id: "hocrm_inbox", label: "Submit to CRM", role: "HoCRM (routing)" },
    { id: "crm_assign_th", label: "Assign to TH–CRM", role: "HoCRM / TH–CRM" },
    { id: "crm_assign_cm", label: "Assign to Credit Manager/Analyst", role: "Team Head–CRM" },
    { id: "decision", label: "Observation or Recommendation?", role: "Decision", kind: "decision" },
    { id: "cm_observation", label: "Observation", role: "Credit Manager" },
    { id: "cm_recommend", label: "Recommendation", role: "Credit Manager" },
    { id: "th_crm", label: "Review Recommendation", role: "Team Head–CRM" },
    { id: "hocrm_review", label: "Review Recommendation", role: "HoCRM" },
    { id: "cro", label: "Approval", role: "CRO" },
    { id: "ceo", label: "Final Approval", role: "CEO" }
  ] as NodeData[],
  edges: [
    { from: "arm_draft", to: "rm_finalize", label: "Submit" },
    { from: "rm_finalize", to: "th_business", label: "Submit" },
    { from: "th_business", to: "cbo_div", label: "Seek recommendation (if needed)" },
    { from: "cbo_div", to: "th_business", label: "Return recommendation" },
    { from: "th_business", to: "hocrm_inbox", label: "Submit to CRM" },
    { from: "hocrm_inbox", to: "crm_assign_th", label: "Assign" },
    { from: "crm_assign_th", to: "crm_assign_cm", label: "Assign" },
    { from: "crm_assign_cm", to: "decision", label: "Decision" },
    { from: "decision", to: "cm_observation", label: "Observation", style: "decision" },
    { from: "decision", to: "cm_recommend", label: "Recommendation", style: "decision" },
    { from: "cm_observation", to: "arm_draft", label: "Send back for correction", style: "dashed" },
    { from: "cm_recommend", to: "th_crm", label: "Forward" },
    { from: "th_crm", to: "hocrm_review", label: "Forward" },
    { from: "hocrm_review", to: "cro", label: "Forward" },
    { from: "cro", to: "ceo", label: "Forward (if authority)" }
  ] as EdgeData[]
};

export const SAMPLE_CASES = [
  {
    id: "APP-24057",
    applicant: "Orion Textiles Ltd.",
    product: "Term Loan",
    amount: 12500000,
    status: "Under Process at CRM",
    currentNodeId: "crm_assign_cm",
    attachments: [
      { name: "Financials_FY23.pdf", size: "1.2MB" },
      { name: "Collateral_Valuation.xlsx", size: "280KB" }
    ],
    remarks: "Awaiting CM assignment; reminder in 2 days."
  },
  {
    id: "APP-24058",
    applicant: "Delta Agro Traders",
    product: "Working Capital",
    amount: 6000000,
    status: "Send Back",
    currentNodeId: "arm_draft",
    attachments: [{ name: "Bank_Statement_Q2.pdf", size: "820KB" }],
    remarks: "Observation: receivables ageing mismatch."
  },
  {
    id: "APP-24059",
    applicant: "City Logistics Co.",
    product: "Name Clearance",
    amount: 0,
    status: "Recommendation Chain",
    currentNodeId: "th_crm",
    attachments: [],
    remarks: "Recommended by CM; TH–CRM review in progress."
  }
];
