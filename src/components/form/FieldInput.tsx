// src/components/form/FieldInput.tsx
import React from "react";
import type { Field } from "../../types/workflow.types";

type Props = {
  field: Field;
  value: unknown;
  disabled?: boolean;
  onChange: (val: string | number | File | undefined) => void;
};

const FieldInput: React.FC<Props> = ({ field, value, disabled, onChange }) => {
  const t = (field.Type || "text").toLowerCase();

  switch (t) {
    case "text":
      return (
        <input
          type="text"
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="form-input"
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={value === "" || value == null ? "" : Number(value as unknown)}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
          disabled={disabled}
          className="form-input"
        />
      );
    case "select":
      return (
        <select
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="form-input"
        >
          <option value="">Select...</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
      );
    case "textarea":
      return (
        <textarea
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="form-textarea"
          rows={4}
        />
      );
    case "file":
      return (
        <input
          type="file"
          onChange={(e) => onChange(e.target.files?.[0])}
          disabled={disabled}
          className="form-input"
        />
      );
    default:
      return null;
  }
};

export default FieldInput;
