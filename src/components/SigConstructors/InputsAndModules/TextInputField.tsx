import React from 'react'
import { GenericInputField } from './GenericInputField'

interface TextInputFieldProps {
  label: string
  inputId: string
  placeholder?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  inputId,
  placeholder = 'Enter text',
  defaultValue,
  onChange,
}) => {
  return (
    <GenericInputField
      label={label}
      inputId={inputId}
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}
