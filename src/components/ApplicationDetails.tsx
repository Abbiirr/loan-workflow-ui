import React from "react";
import { ApplicationHeader } from "./ApplicationHeader";
import WorkflowProgress from "./WorkflowProgress";
import ContactInfo from "./ContactInfo";
import FinancialDetails from "./FinancialDetails";
import RiskSnapshot from "./RiskSnapshot";
import DocumentsSection from "./DocumentsSection";
import AuditTrail from "./AuditTrail";

interface Document {
  name: string;
  filename: string;
  status: "complete" | "review" | "pending";
  required: boolean;
}

interface AuditEntry {
  user: string;
  action: "action" | "system";
  message: string;
  time: string;
}

interface WorkflowStage {
  name: string;
  status: "completed" | "current";
}

interface Application {
  applicant: string;
  product: string;
  amount: number;
  // Add other properties as needed
}

interface ApplicationDetailsProps {
  application: Application;
  onBack: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  onBack,
}) => {
  const workflowStages: WorkflowStage[] = [
    { name: "Application", status: "completed" },
    { name: "Verification", status: "completed" },
    { name: "Underwriting", status: "completed" },
    { name: "Decision", status: "completed" },
    { name: "Disbursement", status: "current" },
  ];

  const documents: Document[] = [
    {
      name: "Identity Verification",
      filename: "id_verification.pdf",
      status: "complete",
      required: true,
    },
    {
      name: "Income Proof",
      filename: "pay_stub_jan2024.pdf",
      status: "complete",
      required: true,
    },
    {
      name: "Bank Statements",
      filename: "bank_statement.pdf",
      status: "review",
      required: true,
    },
    { name: "Credit Report", filename: "", status: "pending", required: true },
    {
      name: "Employment Letter",
      filename: "",
      status: "pending",
      required: false,
    },
  ];

  const auditTrail: AuditEntry[] = [
    {
      user: "Jane Doe",
      action: "action",
      message: "Application approved for full amount",
      time: "1/15/2024, 3:15:00 PM",
    },
    {
      user: "Jane Doe",
      action: "action",
      message: "Application assigned for review",
      time: "1/15/2024, 2:30:00 PM",
    },
    {
      user: "System",
      action: "system",
      message: "Application submitted",
      time: "1/15/2024, 6:00:00 AM",
    },
  ];

  return (
    <div
      style={{
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ApplicationHeader application={application} onBack={onBack} />
      
      <WorkflowProgress workflowStages={workflowStages} />

      {/* Main Content */}
      <div
        style={{
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        <ContactInfo applicant={application.applicant} />
        <FinancialDetails amount={application.amount} />
        <RiskSnapshot />
      </div>

      {/* Documents Section */}
      <div
        style={{
          padding: "0 24px 24px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <DocumentsSection documents={documents} />
        <AuditTrail auditTrail={auditTrail} />
      </div>
    </div>
  );
};

export default ApplicationDetails;