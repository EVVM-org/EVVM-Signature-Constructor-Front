import React from 'react'
import styles from '@/components/SigConstructors/SignatureConstructor.module.css'
import { Divider, Input } from '@mantine/core'

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
    <>
      <p>{label}</p>
      <div
        style={{
          marginBottom: '1rem',
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Input
          type="number"
          size="compact-md"
          placeholder={placeholder}
          id={inputId}
          defaultValue={defaultValue}
        />
      </div>
    </>
  )
}
