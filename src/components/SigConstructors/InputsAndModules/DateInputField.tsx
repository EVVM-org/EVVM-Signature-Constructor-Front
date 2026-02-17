import React from "react";
import styles from "@/components/SigConstructors/SignatureConstructor.module.css";
import { Input } from "@mantine/core";

interface DateInputFieldProps {
  label: string;
  inputId: string;
  placeholder?: string;
  defaultValue?: string;
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  inputId,
  placeholder = "Select date",
  defaultValue,
}) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p>{label}</p>
      <Input
      size="compact-md"
        type="datetime-local"
        style={{
            maxWidth: '20vw',
          }}
        placeholder={placeholder}
        id={inputId}
        defaultValue={defaultValue}
      />
    </div>
  );
};