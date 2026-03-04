import React from 'react'
import { GenericInputField } from './GenericInputField'

interface NumberInputFieldProps {
  label: string
  inputId: string
  placeholder?: string
  defaultValue?: string
}

export const NumberInputField: React.FC<NumberInputFieldProps> = ({
  label,
  inputId,
  placeholder = 'Enter number',
  defaultValue,
}) => {
  return (
    <GenericInputField
      label={label}
      inputId={inputId}
      type="number"
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  )
}
