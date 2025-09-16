// src/features/application-details/components/ContactInfo.tsx
import React from "react";
import { Phone } from "lucide-react";

const ContactInfo: React.FC<{ applicant: string }> = ({ applicant }) => (
  <div
    style={{
      background: "white",
      borderRadius: "8px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      height: "100%",
    }}
  >
    <h3
      style={{
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Phone size={18} />
      Contact Information
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ fontSize: "14px", color: "#6b7280" }}>
        Name: {applicant}
      </div>
      <div style={{ fontSize: "14px", color: "#6b7280" }}>
        ✉️ {applicant.toLowerCase().replace(" ", ".")}@email.com
      </div>
      <div style={{ fontSize: "14px", color: "#6b7280" }}>
        📞 (555) 123-4567
      </div>
    </div>
  </div>
);

export default ContactInfo;
