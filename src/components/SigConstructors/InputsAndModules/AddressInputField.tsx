import React from 'react'
import styles from '@/components/SigConstructors/SignatureConstructor.module.css'
import { Input } from '@mantine/core'

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
    <>
      <p>{label}</p>
      <div
        style={{
          marginBottom: '1rem',
          marginTop: '0.5rem',
        }}
      >
        <Input
          size="compact-md"
          type="text"
          placeholder={placeholder}
          id={inputId}
          defaultValue={defaultValue}
          style={{
            maxWidth: '30vw',
          }}
        />
      </div>
    </>
  )
}
