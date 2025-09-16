// src/components/FormViewer.tsx
import React, { useState } from "react";
import { Edit, Save, ArrowLeft } from "lucide-react";
import type { Field, State } from "../types/workflow.types";
import FieldInput from "./form/FieldInput";

interface FormViewerProps {
  stateName: string;
  state: State | undefined;
  onSubmit?: (data: Record<string, unknown>) => void;
  onReject?: (data: Record<string, unknown>) => void;
  onBack?: () => void;
}

const FormViewer: React.FC<FormViewerProps> = ({
  stateName,
  state,
  onSubmit,
  onReject,
  onBack,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [editMode, setEditMode] = useState(false);

  const handleFieldChange = (
    fieldId: string,
    value: string | number | File | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: Field) => (
    <FieldInput
      field={field}
      value={formData[field.ID]}
      disabled={!editMode}
      onChange={(val) => handleFieldChange(field.ID, val)}
    />
  );

  return (
    <div className="form-viewer">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Graph
        </button>
        <h2>{stateName}</h2>
        <div className="form-status">
          <span className="status-badge">Finalized</span>
        </div>
        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          {editMode ? <Save size={16} /> : <Edit size={16} />}
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-content">
        {state?.Form?.Fields?.map((field) => (
          <div key={field.ID} className="form-group">
            <div className="field-row">
              <label className="field-label">{field.Name}</label>
              <div className="field-value">{renderField(field)}</div>
              <div className="field-status">
                <span className="status-text">Correction needed</span>
                <button className="recommend-btn">Recommendation</button>
              </div>
            </div>

            {(field.Actions?.length ?? 0) > 0 && (
              <div className="field-actions">
                {(field.Actions ?? []).map((action) => (
                  <span key={action} className="action-tag">
                    {action}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-footer">
        <button className="btn-save" onClick={() => onSubmit?.(formData)}>
          Save
        </button>
        <button className="btn-submit" onClick={() => onSubmit?.(formData)}>
          Submit
        </button>
        <button className="btn-reject" onClick={() => onReject?.(formData)}>
          Reject
        </button>
        <button className="btn-approve" onClick={() => onSubmit?.(formData)}>
          Approve
        </button>
      </div>
    </div>
  );
};

export default FormViewer;
