import React from 'react'
import { Input } from '@mantine/core'

export interface GenericInputFieldProps {
  label: string
  inputId: string
  type?: 'text' | 'number' | 'datetime-local' | 'email'
  placeholder?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  maxWidth?: string
  min?: string
  step?: string
}

export const GenericInputField = React.memo<GenericInputFieldProps>(({
  label,
  inputId,
  type = 'text',
  placeholder,
  defaultValue,
  onChange,
  maxWidth = '100%',
  min,
  step,
}) => {
  return (
    <>
      <p>{label}</p>
      <div style={{ marginBottom: '1rem', marginTop: '0.5rem', maxWidth }}>
        <Input
          type={type}
          placeholder={placeholder}
          id={inputId}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          step={step}
        />
      </div>
    </>
  )
})

GenericInputField.displayName = 'GenericInputField'
