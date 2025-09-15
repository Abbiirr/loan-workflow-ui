import React, { useState } from "react";
import { AlertCircle, Check } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  error: string | null;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  onApply,
  error,
}) => {
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    try {
      if (newValue.trim()) {
        JSON.parse(newValue);
        setIsValid(true);
      }
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "12px",
          background: "#f3f4f6",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: "600",
            color: "#000000",
          }}
        >
          Workflow JSON
        </h3>
        <button
          onClick={onApply}
          disabled={!isValid}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            background: isValid ? "#4f46e5" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: isValid ? "pointer" : "not-allowed",
            transition: "background 0.2s",
          }}
        >
          <Check size={14} />
          Apply Changes
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <textarea
          value={value}
          onChange={handleChange}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            background: "#1f2937",
            color: "#f3f4f6",
            fontFamily: "Consolas, Monaco, monospace",
            fontSize: "12px",
            resize: "none",
            outline: "none",
          }}
          spellCheck={false}
        />

        {!isValid && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              right: "12px",
              padding: "8px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#991b1b",
            }}
          >
            <AlertCircle size={14} />
            Invalid JSON syntax
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "8px 12px",
              background: "#fef2f2",
              borderTop: "1px solid #fecaca",
              fontSize: "12px",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
