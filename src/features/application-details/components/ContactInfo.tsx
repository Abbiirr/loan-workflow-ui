// src/features/application-details/components/ContactInfo.tsx
import React from "react";
import { Phone } from "lucide-react";

const ContactInfo: React.FC<{ applicant: string }> = ({ applicant }) => (
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginTop: 0 }}>Contact Info</h3>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontWeight: 500 }}>Name:</span> {applicant}
    </div>
    <div style={{ color: "#6b7280" }}>
      Email: {applicant.toLowerCase().replace(/\s+/g, ".")}@example.com
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Phone size={16} color="#6b7280" /> <span>(555) 123-4567</span>
    </div>
  </div>
);

export default ContactInfo;
