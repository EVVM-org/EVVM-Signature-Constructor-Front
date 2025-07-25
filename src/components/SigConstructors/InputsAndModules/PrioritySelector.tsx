import React from "react";

interface PrioritySelectorProps {
  onPriorityChange: (priority: string) => void;
  marginTop?: string;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  onPriorityChange,
  marginTop = "1rem",
}) => {
  return (
    <div style={{ marginTop }}>
      <p>Priority</p>
      <select
        style={{
          color: "black",
          backgroundColor: "white",
          height: "2rem",
          width: "12rem",
        }}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="low">Low (synchronous nonce)</option>
        <option value="high">High (asynchronous nonce)</option>
      </select>
    </div>
  );
};