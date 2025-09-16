// src/components/ResultsCount.tsx
import React from "react";

interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({
  filteredCount,
  totalCount,
}) => {
  return (
    <div style={{ padding: "12px 24px", fontSize: "14px", color: "#6b7280" }}>
      Showing {filteredCount} of {totalCount} applications
    </div>
  );
};

export default ResultsCount;
