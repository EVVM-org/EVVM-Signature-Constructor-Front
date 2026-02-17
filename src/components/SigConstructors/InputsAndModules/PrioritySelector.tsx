import React from "react";
import { Input, SegmentedControl } from "@mantine/core";

interface PrioritySelectorProps {
  onPriorityChange: (priority: "low" | "high") => void;
  marginTop?: string;
}

/**
	* Offers two priority types of execution: sync (low) and async (high)
*/
export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  onPriorityChange,
  marginTop = "1rem",
}) => {
  return (
    <div style={{ marginTop }}>
      <Input.Wrapper label="EVVM Nonce Type">
      <br/>
      <SegmentedControl
        size="sm"
        defaultValue="low"
        onChange={(value) => onPriorityChange(value as "low" | "high")}
        data={[
          { label: "sync", value: "low" },
          { label: "async", value: "high" },
        ]}
      />
      </Input.Wrapper>
    </div>
  );
};
