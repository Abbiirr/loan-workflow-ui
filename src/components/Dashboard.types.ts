export interface LoanApplication {
  id: string;
  applicant: string;
  product: string;
  amount: number;
  stage: string;
  assignee: string;
  sla: string;
  slaStatus: "ontime" | "due" | "overdue";
  lastUpdate: string;
  flags: string[];
  docs?: number;
}