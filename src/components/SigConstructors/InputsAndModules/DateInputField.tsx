import React from "react";
import { GenericInputField } from './GenericInputField'

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
    <GenericInputField
      label={label}
      inputId={inputId}
      type="datetime-local"
      placeholder={placeholder}
      defaultValue={defaultValue}
      maxWidth="20vw"
    />
  );
};