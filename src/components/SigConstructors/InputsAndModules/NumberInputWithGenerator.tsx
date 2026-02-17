import React from 'react'
import mersenneTwister from '@/utils/mersenneTwister'
import styles from '@/components/SigConstructors/SignatureConstructor.module.css'
import { Button, Divider, Input, Tooltip } from '@mantine/core'

interface NumberInputWithGeneratorProps {
  label: string
  inputId: string
  placeholder?: string
  buttonText?: string
  showRandomBtn?: boolean
}

export const NumberInputWithGenerator: React.FC<
  NumberInputWithGeneratorProps
> = ({
  label,
  inputId,
  placeholder = 'Enter number',
  buttonText = `Generate Random ${label}`,
  showRandomBtn = true,
}) => {
  const generateRandomNumber = () => {
    const seed = Math.floor(Math.random() + Date.now())
    const mt = mersenneTwister(seed)
    const number = mt.int32()
    ;(document.getElementById(inputId) as HTMLInputElement).value =
      number.toString()
  }

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
          size="compact-md"
          type="number"
          placeholder={placeholder}
          id={inputId}
          style={{
            maxWidth: '20vw',
          }}
        />
        {showRandomBtn && (
          <Tooltip label={buttonText}>
            <Button size="compact-md" onClick={generateRandomNumber}>
              Generate
            </Button>
          </Tooltip>
        )}
      </div>
    </>
  )
}
