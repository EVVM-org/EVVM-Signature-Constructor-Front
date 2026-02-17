import React from 'react'
import styles from '@/components/SigConstructors/SignatureConstructor.module.css'
import { Input } from '@mantine/core'

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
    <>
      <p>{label}</p>
      <div style={{
          marginBottom: '1rem',
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
        <Input
          type="text"
          size="compact-md"
          placeholder={placeholder}
          id={inputId}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </div>
    </>
  )
}
