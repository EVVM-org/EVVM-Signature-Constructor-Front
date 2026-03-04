import React from 'react'
import { GenericInputField } from './GenericInputField'

interface AddressInputFieldProps {
  label: string
  inputId: string
  placeholder?: string
  defaultValue?: string
}

export const AddressInputField: React.FC<AddressInputFieldProps> = ({
  label,
  inputId,
  placeholder = 'Enter address',
  defaultValue,
}) => {
  return (
    <GenericInputField
      label={label}
      inputId={inputId}
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      maxWidth="30vw"
    />
  )
}
