import { Input, SegmentedControl } from '@mantine/core'
import React from 'react'

interface StakingActionSelectorProps {
  onChange: (isStaking: boolean) => void
  defaultValue?: boolean
}

export const StakingActionSelector: React.FC<StakingActionSelectorProps> = ({
  onChange,
  defaultValue = true,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <SegmentedControl
        size="sm"
        defaultValue={defaultValue.toString()}
        onChange={(value) => onChange(value === 'true')}
        data={[
          { label: 'Staking', value: 'true' },
          { label: 'Unstaking', value: 'false' },
        ]}
      />
    </div>
  )
}
