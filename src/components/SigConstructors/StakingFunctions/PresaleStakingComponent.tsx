'use client'
import React from 'react'
import {
  Core,
  Staking,
  type IPresaleStakingData,
  type IPayData,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  StakingActionSelector,
} from '@/components/SigConstructors/InputsAndModules'
import { Button } from '@mantine/core'

import { StakingComponentProps } from '@/types'

type InputData = {
  IPresaleStakingData: ISerializableSignedAction<IPresaleStakingData>
  IPayData: ISerializableSignedAction<IPayData>
}

export const PresaleStakingComponent = ({
  stakingAddress,
  coreAddress,
}: StakingComponentProps) => {
  const [isStaking, setIsStaking] = React.useState(true)
  const [priority, setPriority] = React.useState<'low' | 'high'>('high')
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null)
  const [loading, setLoading] = React.useState(false)

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value

    if (!stakingAddress) {
      console.error('Staking address is required')
      return
    }

    const priorityFeePay = getValue('priorityFeeInput_presaleStaking')
    const noncePay = getValue('nonceEVVMInput_presaleStaking')
    const nonce = getValue('nonceStakingInput_presaleStaking')

    if (!priorityFeePay || !noncePay || !nonce) {
      console.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      const signer = await getEvvmSigner()
      const evvm = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })
      const stakingService = new Staking({
        signer,
        address: stakingAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      const amountOfToken = BigInt(1) * BigInt(10) ** BigInt(18)

      const payAction = await evvm.pay({
        toAddress: stakingAddress as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: amountOfToken,
        priorityFee: BigInt(priorityFeePay),
        nonce: BigInt(noncePay),
        isAsyncExec: true,
        senderExecutor: stakingAddress as `0x${string}`,
      })

      const stakingAction = await stakingService.presaleStaking({
        isStaking,
        nonce: BigInt(nonce),
        evvmSignedAction: payAction,
      })

      setDataToGet({
        IPresaleStakingData: stakingAction.toJSON(),
        IPayData: payAction.toJSON(),
      })
    } catch (error) {
      console.error('Error creating signature:', error)
    } finally {
      setLoading(false)
    }
  }

  const executePresale = async () => {
    if (!dataToGet || !stakingAddress) {
      console.error('Missing data or address')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet.IPresaleStakingData)
      console.log('Presale staking executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing presale staking:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Presale Staking"
        link="https://www.evvm.info/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />
      <p>A presale staker can stake/unstake one sMATE per transaction.</p>
      <br />

      <StakingActionSelector onChange={setIsStaking} />

      <NumberInputWithGenerator
        label="Staking Nonce"
        inputId="nonceStakingInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_presaleStaking"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="Core (pay) Async Nonce"
        inputId="nonceEVVMInput_presaleStaking"
        placeholder="Enter nonce"
        showRandomBtn={true}
      />

      <Button
        onClick={makeSig}
        disabled={loading}
        loading={loading}
        style={{
          padding: '0.5rem',
          marginTop: '1rem',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Creating...' : 'Create Signature'}
      </Button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executePresale}
      />
    </div>
  )
}
