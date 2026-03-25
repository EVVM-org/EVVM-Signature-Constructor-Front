import React from 'react'
import { Input, NativeSelect } from '@mantine/core'

interface ExecutorSelectorProps {
  label?: string
  inputId: string
  placeholder?: string
  onToggle: (isEnabled: boolean) => void
  value: boolean
}

export const ExecutorSelector = React.memo<ExecutorSelectorProps>(({
  label = 'Are you using an senderExecutor?',
  inputId,
  placeholder = 'Enter senderExecutor',
  onToggle,
  value,
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
          value={value ? 'true' : 'false'}
          onChange={(e) => onToggle(e.currentTarget.value === 'true')}
          data={[
            { label: 'No', value: 'false' },
            { label: 'Yes', value: 'true' },
          ]}
          style={{
            width: '5rem',
          }}
          size="xs"
        />
        {value && (
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
})

ExecutorSelector.displayName = 'ExecutorSelector'
