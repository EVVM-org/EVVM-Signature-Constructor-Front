import React from 'react'
import { Input, NativeSelect } from '@mantine/core'

interface ExecutorSelectorProps {
  label?: string
  inputId: string
  placeholder?: string
  onExecutorToggle: (isUsing: boolean) => void
  isUsingExecutor: boolean
}

export const ExecutorSelector: React.FC<ExecutorSelectorProps> = ({
  label = 'Are you using an senderExecutor?',
  inputId,
  placeholder = 'Enter senderExecutor',
  onExecutorToggle,
  isUsingExecutor,
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
        <NativeSelect
          value={isUsingExecutor ? 'true' : 'false'}
          onChange={(e) => onExecutorToggle(e.currentTarget.value === 'true')}
          data={[
            { label: 'No', value: 'false' },
            { label: 'Yes', value: 'true' },
          ]}
          style={{
            width: '5rem',
          }}
          size="xs"
        />
        {isUsingExecutor && (
          <Input
            type="text"
            size="compact-md"
            placeholder={placeholder}
            id={inputId}
            style={{
              width: '25rem',
            }}
          />
        )}
      </div>
    </>
  )
}
